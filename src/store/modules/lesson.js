import Vue from "vue";
import _ from "lodash";
const cards = require("store/cards.json");
const datetime = require("js/utils/datetime");
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
    let key = moment(state.selectedDate).format("YYYY-MM-DD");

    if (state.records[key] === undefined) {
      Vue.set(state.records, key, {
        diary: {
          text: ""
        },
        weightedCards: []
      });
    }

    let weightedCards = state.records[key].weightedCards;

    let selectedWeights = {};
    weightedCards.forEach(weight => {
      if (weight.selected === true) {
        selectedWeights[weight.value] = true;
      }
    });

    let selectedCards = {};
    weightedCards.forEach(weight => {
      weight.cards.forEach(card => {
        if (card.selected === true) {
          selectedCards[card.id] = true;
        }
      });
    });

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
  }
};

const mutations = {
  lesson_setDeselect(state, data) {
    if (data.checked) {
      let index = _.indexOf(state.deselects, data.id);
      if (index >= 0) {
        state.deselects.splice(index, 1);
      }
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
  // lesson_getDateRecord({
  //   state,
  //   rootState
  // }) {
  //   let key = getDateKey(state.selectedDate);
  //   if (state.records[key] === undefined) {
  //     state.records[key] = {
  //       diary: "",
  //       cards: []
  //     };
  //   }

  //   let collated = [];

  //   cards.forEach(card => {
  //     let cardset = collated[card.weight - 1];
  //     if (cardset === undefined) {
  //       cardset = {
  //         value: card.weight,
  //         name: getWeightName(card.weight),
  //         cards: []
  //       };
  //       collated[card.weight - 1] = cardset;
  //     }

  //     if (card.group) {
  //       if (state.difficulties[card.group] != card.id) {
  //         return;
  //       }
  //     }

  //     if (rootState.user.grade.lv < card.unlock) {
  //       return;
  //     }

  //     if (_.indexOf(state.deselects, card.id) != -1) {
  //       return;
  //     }

  //     cardset.cards.push(Object.assign({
  //       selected: false
  //     }, card));
  //   });

  //   collated.forEach(cardset => {
  //     if (cardset.cards.length > 0) {
  //       state.records[key].cards.push(cardset);
  //     }
  //   });

  //   return state.records[key].cards;
  // },
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