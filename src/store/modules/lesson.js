import Vue from "vue";
import _ from "lodash";
import api from "api";
const cards = require("store/cards.json");
const datetime = require("js/utils/datetime");
const textHelper = require("js/utils/textHelper");
const ch = require("js/utils/collectionHelper");
const moment = require("moment");

function getDateKey(state) {
  return moment(state.selectedDate).format("YYYY-MM-DD");
}

const state = {
  settingsLoaded: false,
  selectedDate: datetime.date(moment()).subtract(1, "days").toDate(),
  cards,
  deselects: [],
  difficulties: {
    "304": 304,
    "401": 401,
    "411": 411
  },
  records: {}
};

const getters = {
  lesson_getDateKey(state) {
    return getDateKey(state);
  },
  lesson_getDifficultCards() {
    let result = [];
    let group;

    cards.forEach(card => {
      if (card.group) {
        if (group === undefined || group.id != card.group) {
          group = {
            id: card.group,
            options: []
          };
          result.push(group);
        }
        group.options.push({
          value: card.id,
          text: card.name
        });
      }
    });

    return result;
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

const mutations = {
  lesson_setDiary(state, data) {
    let dateKey = getDateKey(state);
    let record = state.records[dateKey];
    let card = record.weightedCards[0].cards.find(card => {
      return card.id == 100;
    });
    if (data) {
      record.diary.text = data;
      record.selectedCards[card.id] = true;
    } else {
      record.diary.text = "";
      record.selectedCards[card.id] = false;
    }
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
  lesson_selectDate({
    state,
    dispatch
  }, date) {
    state.selectedDate = date;
    return dispatch("lesson_assignRecord");
  },
  async lesson_assignRecord({
    state,
    rootState
  }) {
    let dateKey = getDateKey(state);
    let record = state.records[dateKey];

    if (record === undefined) {
      record = {
        diary: {
          text: ""
        },
        published: false,
        weightedCards: [],
        selectedWeights: {},
        selectedCards: {}
      };
      Vue.set(state.records, getDateKey(state), record);

      let userid = rootState.user._id;
      let storagedItem = localStorage[`${userid}_lesson_${dateKey}`];
      if (storagedItem) {
        let data = JSON.parse(storagedItem);
        Object.assign(record, data);

        record.checkedCards.forEach(cardId => {
          record.selectedCards[cardId] = true;
        });
        delete record.checkedCards;
      } else {
        let date = datetime.utcDate(state.selectedDate);
        try {
          let res = await api.getLesson(userid, date);
          if (res.status == 200) {
            record.published = true;
            record.diary.text = res.data.text;
            res.data.checkedCards.forEach(cardId => {
              record.selectedCards[cardId] = true;
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    let weightedCards = record.weightedCards;
    weightedCards.splice(0, weightedCards.length);

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

      cardset.cards.push(Object.assign({}, card));
    });

    return record;
  },
  lesson_selectAllCards({
    state
  }, data) {
    let record = state.records[getDateKey(state)];
    record.selectedWeights[data.id] = data.checked;
    record.weightedCards.find(weight => weight.value == data.id).cards.forEach(card => {
      Vue.set(record.selectedCards, card.id, data.checked);
    });
  },
  lesson_selectCard({
    state,
  }, data) {
    let record = state.records[getDateKey(state)];
    record.selectedCards[data.id] = data.checked;
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
      expectedExp: 0
    };

    return data;
  },
  lesson_publish({
    state,
    dispatch
  }) {
    let record = state.records[getDateKey(state)];
    record.published = true;
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
      checkedCards
    };

    let date = getDateKey(state);
    localStorage[`${userid}_lesson_${date}`] = JSON.stringify(data);
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
  }
};

export default {
  state,
  mutations,
  getters,
  actions
};