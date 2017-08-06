import Vue from "vue";
import _ from "lodash";
import api from "api";
import datetime from "js/utils/datetime";
import textHelper from "js/utils/textHelper";
import ch from "js/utils/collectionHelper";
const cards = require("store/cards.json");
const moment = require("moment");

function getDateKey(state) {
  return moment(state.selectedDate).format("YYYYMMDD");
}

const state = {
  // 当前选定功课日期
  selectedDate: datetime.date(moment()).subtract(1, "days").toDate(),

  // 功课卡数据
  cards,

  // 未开启的功课
  deselects: [],

  // 功课难度
  difficulties: {
    "304": 304,
    "401": 401,
    "411": 411
  },

  // 选定的功课数据记录
  records: {},

  // 已保存的功课日期
  savedDates: []
};

const getters = {
  lesson_getDateKey(state) {
    return getDateKey(state);
  },

  lesson_getManagedCards(state) {
    let result = [];

    cards.forEach(card => {
      let cardset = result[card.weight - 1];
      if (cardset === undefined) {
        cardset = {
          value: card.weight,
          name: textHelper.getLessonWeightName(card.weight),
          cards: []
        };
        result.push(cardset);
      }

      if (card.group && card.group != card.id) {
        return;
      }

      cardset.cards.push(Object.assign({
        selected: _.indexOf(state.deselects, card.id) == -1
      }, card));
    });

    return result;
  },
};

function getSelectedCount(record) {
  let result = 0;
  _.each(record.selectedCards, item => {
    if (item) {
      result++;
    }
  });
  return result;
}

const mutations = {
  lesson_selectAllCards(state, data) {
    let record = state.records[getDateKey(state)];
    record.weightedCards.find(weight => weight.value == data.id).cards.forEach(card => {
      Vue.set(record.selectedCards, card.id.toString(), data.checked);
    });
    record.selectedCount = getSelectedCount(record);
  },
  lesson_selectCard(state, data) {
    let record = state.records[getDateKey(state)];
    Vue.set(record.selectedCards, data.id.toString(), data.checked);

    record.selectedCount = getSelectedCount(record);
  },
  lesson_setPictureUrl(state, data) {
    let dateKey = getDateKey(state);
    let record = state.records[dateKey];
    let picture = _.find(record.diary.pictures, item => {
      return item.id == data.id;
    });
    picture.url = data.url;
  },
  lesson_setDiary(state, data) {
    let dateKey = getDateKey(state);
    let record = state.records[dateKey];
    let card = record.weightedCards[0].cards.find(card => {
      return card.id == 100;
    });
    if (data.text) {
      record.diary.text = data.text;
      Vue.set(record.selectedCards, card.id.toString(), true);
    } else {
      record.diary.text = "";
      Vue.set(record.selectedCards, card.id.toString(), false);
    }
    record.diary.pictures = data.pictures;
  },
  lesson_setDeselect(state, data) {
    if (data.checked) {
      ch.remove(state.deselects, data.id);
    } else {
      state.deselects.push(data.id);
    }
  },
  lesson_setDifficulty(state, data) {
    state.difficulties[data.id] = data.selected;
  },
  lesson_assignDeselect(state, data) {
    state.deselects = data;
  },
  lesson_assignDifficulty(state, data) {
    state.difficulties = data;
  }
};

const actions = {
  lesson_getCards({
    state
  }, cardIdArray) {
    let mapCardIdArray = _.keyBy(cardIdArray, id => {
      return id;
    });
    let cards = [];
    state.cards.forEach(card => {
      if (mapCardIdArray[card.id]) {
        cards.push(card);
      }
    });
    return cards;
  },
  async lesson_selectDate({
    state,
    dispatch
  }, date) {
    state.selectedDate = date;
    let record = await dispatch("lesson_getRecord");
    return record;
  },
  async lesson_getRecord({
    state,
    rootState
  }) {
    let dateKey = getDateKey(state);
    let record = state.records[dateKey];

    if (record === undefined) {
      record = {
        diary: {
          text: "",
          pictures: []
        },
        published: false,
        weightedCards: [],
        selectedWeights: {},
        selectedCards: {},
        selectedCount: 0,
        cardCount: 0,
        exp: 0
      };
      Vue.set(state.records, getDateKey(state), record);

      let userid = rootState.user._id;
      let storagedItem = localStorage[`${userid}_lesson_${dateKey}`];
      if (storagedItem) {
        let data = JSON.parse(storagedItem);
        Object.assign(record, data);

        record.checkedCards.forEach(cardId => {
          Vue.set(record.selectedCards, cardId.toString(), true);
        });
        record.selectedCount = getSelectedCount(record);
        delete record.checkedCards;
      } else {
        let date = datetime.utcDate(state.selectedDate);
        try {
          let res = await api.getLesson(userid, date);
          if (res.status == 200) {
            record.published = true;
            record.exp = res.data.exp;
            record.diary.text = res.data.text;
            if (res.data.pictures) {
              res.data.pictures.forEach(item => {
                record.diary.pictures.push({
                  url: textHelper.getPictureUrl(item)
                });
              });
            }
            res.data.checkedCards.forEach(cardId => {
              Vue.set(record.selectedCards, cardId.toString(), true);
            });
            record.selectedCount = getSelectedCount(record);
            if (record.diary.text) {
              Vue.set(record.selectedCards, "100", true);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    let weightedCards = record.weightedCards;
    weightedCards.splice(0, weightedCards.length);
    let cardCount = 0;

    cards.forEach(card => {
      let cardset = weightedCards[card.weight - 1];
      if (cardset === undefined) {
        cardset = {
          value: card.weight,
          name: textHelper.getLessonWeightName(card.weight),
          cards: []
        };
        weightedCards.push(cardset);
      }
      if (rootState.user.grade.lv < card.unlock) {
        return;
      }

      if (card.group) {
        if (state.difficulties[card.group] != card.id) {
          return;
        }
        if (_.indexOf(state.deselects, card.group) != -1) {
          return;
        }
      } else {
        if (_.indexOf(state.deselects, card.id) != -1) {
          return;
        }
      }

      // 生成功课等级符号
      let userCard = rootState.user.cards[card.id];
      if (userCard) {
        let cardlv = userCard.lv;
        if (cardlv > 1) {
          card.rates = _.fill(Array(cardlv - 1), 0);
        } else {
          card.rates = [];
        }
      }

      cardset.cards.push(Object.assign({}, card));
      cardCount++;
    });

    record.cardCount = cardCount;

    return record;
  },
  lesson_getPublishData({
    state,
    rootState
  }) {
    let record = state.records[getDateKey(state)];

    // 得到勾选的功课
    let checkedCards = [];
    _.each(record.selectedCards, (checked, card) => {
      if (checked) {
        checkedCards.push(card);
      }
    });

    let userid = rootState.user._id;

    let data = {
      checkedCards,
      userid,
      time: state.selectedDate,
      text: record.diary.text,
      pictures: record.diary.pictures,
      expectedExp: 0
    };

    return data;
  },
  lesson_publish({
    state,
    dispatch
  }, {
    exp
  }) {
    let record = state.records[getDateKey(state)];
    record.published = true;
    record.exp = exp;
    return dispatch("lesson_save");
  },
  async lesson_save({
    state,
    rootState
  }) {
    let userid = rootState.user._id;
    let record = state.records[getDateKey(state)];

    // 得到勾选的功课
    let checkedCards = [];
    _.each(record.selectedCards, (checked, card) => {
      if (checked) {
        checkedCards.push(card);
      }
    });

    // 本地存储的数据
    let data = {
      diary: record.diary,
      published: record.published,
      checkedCards,
      exp: record.exp || 0
    };

    let date = getDateKey(state);
    localStorage[`${userid}_lesson_${date}`] = JSON.stringify(data);

    ch.put(state.savedDates, date);
    localStorage[`${userid}_lesson_savedDates`] = JSON.stringify(state.savedDates);
  },

  lesson_getSavedDates({
    state,
    rootState
  }) {
    let userid = rootState.user._id;
    try {
      state.savedDates = JSON.parse(localStorage[`${userid}_lesson_savedDates`]);
      state.savedDates.push("20170718");
    } catch (error) {
      state.savedDates = [];
    }
  },

  lesson_loadSettings({
    commit,
    rootState
  }) {
    let userid = rootState.user._id;

    let data = localStorage[`${userid}_lessonDifficulties`];
    if (data) {
      commit("lesson_assignDifficulty", JSON.parse(data));
    }
    data = localStorage[`${userid}_lessonDeselects`];
    if (data) {
      commit("lesson_assignDeselect", JSON.parse(data));
    }
  },

  lesson_saveSettings({
    state,
    rootState
  }) {
    let userid = rootState.user._id;

    localStorage[`${userid}_lessonDifficulties`] = JSON.stringify(state.difficulties);
    localStorage[`${userid}_lessonDeselects`] = JSON.stringify(state.deselects);
  },

  lesson_getDifficultCards({
    rootState
  }) {
    let result = [];
    let group;
    let userCards = rootState.user.cards;

    cards.forEach(card => {
      if (card.group) {
        if (group === undefined || group.id != card.group) {
          group = {
            id: card.group,
            options: []
          };
          result.push(group);
        }

        // 处理麦式运动难度
        if (card.id >= 305 && card.id <= 313) {
          if (!userCards) return;
          let userCard = userCards[card.id - 1];
          if (!userCard) return;
          if (userCard.lv < 2) return;
        }
        group.options.push({
          value: card.id,
          text: card.name
        });
      }
    });

    return result;
  },
};

export default {
  state,
  mutations,
  getters,
  actions
};