import Vue from "vue";
import _ from "lodash";
const cards = require("store/cards.json");
const datetime = require("js/utils/datetime");
const ch = require("js/utils/collectionHelper");
const moment = require("moment");

function getWeightName(weight) {
  switch (weight) {
  case 1:
    return "最重要功课";
  case 2:
    return "重要功课";
  case 3:
    return "次重要功课";
  }
}

function getDateKey(state) {
  return moment(state.selectedDate).format("YYYY-MM-DD");
}

function getSelectedDateRecord(state) {
  let key = getDateKey(state);
  return state.records[key];
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
  lesson_getCards(state, getters, rootState) {
    let record = getSelectedDateRecord(state);
    if (record === undefined) {
      record = {
        diary: {
          text: ""
        },
        loaded: false,
        weightedCards: []
      };
      Vue.set(state.records, getDateKey(state), record);
    }

    let weightedCards = record.weightedCards;

    let selectedWeights = {};
    weightedCards.forEach(weight => {
      if (weight.selected === true) {
        selectedWeights[weight.value] = true;
      }
    });

    let selectedCards = {};
    if (record.loaded) {
      weightedCards.forEach(weight => {
        weight.cards.forEach(card => {
          if (card.selected === true) {
            selectedCards[card.id] = true;
          }
        });
      });
    } else {
      let userid = rootState.user._id;
      let date = getDateKey(state);
      let storagedItem = localStorage[`${userid}_lesson_${date}`];
      if (storagedItem) {
        let data = JSON.parse(storagedItem);
        console.log(data);
        record.diary = data.diary;
        data.checkedCards.forEach(item => {
          selectedCards[item] = true;
        });
      }

      record.loaded = true;
    }

    weightedCards.splice(0, weightedCards.length);

    cards.forEach(card => {
      let cardset = weightedCards[card.weight - 1];
      if (cardset === undefined) {
        cardset = {
          value: card.weight,
          name: getWeightName(card.weight),
          selected: selectedWeights[card.weight] ? true : false,
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

      cardset.cards.push(Object.assign({
        selected: selectedCards[card.id] ? true : false
      }, card));
    });

    return weightedCards;
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
          name: getWeightName(card.weight),
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
  lesson_getDiary(state) {
    let record = getSelectedDateRecord(state);
    return record ? record.diary.text : "";
  }
};

const mutations = {
  lesson_setDiary(state, data) {
    try {
      let record = getSelectedDateRecord(state);
      let card = _.find(record.weightedCards[0].cards, card => {
        return card.id == 100;
      });
      if (data) {
        record.diary.text = data;
        card.selected = true;
      } else {
        record.diary.text = "";
        card.selected = false;
      }
    } catch (error) {
      console.log(error);
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
  lesson_save({
    state,
    rootState
  }) {
    let userid = rootState.user._id;

    let record = getSelectedDateRecord(state);

    // 得到勾选的功课
    let checkedCards = [];
    record.weightedCards.forEach(weight => {
      weight.cards.forEach(card => {
        if (card.selected === true) {
          checkedCards.push(card.id);
        }
      });
    });

    // 本地存储的数据
    let data = {
      diary: record.diary,
      checkedCards
    };

    let date = getDateKey(state);
    console.log("save lesson");
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