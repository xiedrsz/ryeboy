import _ from "lodash";
const cards = require("store/cards.json");

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
  deselects: [],
  difficulties: {
    "304": 304,
    "401": 401,
    "411": 411
  }
};

const getters = {
  lesson_getAvailableCards(state, getters, rootState) {
    let collated = [];

    cards.forEach(card => {
      let cardset = collated[card.weight - 1];
      if (cardset === undefined) {
        cardset = {
          value: card.weight,
          name: getWeightName(card.weight),
          cards: []
        };
        collated[card.weight - 1] = cardset;
      }

      if (card.group) {
        if (state.difficulties[card.group] != card.id) {
          return;
        }
      }

      if (rootState.user.grade.lv < card.unlock) {
        return;
      }

      if (_.indexOf(state.deselects, card.id) != -1) {
        return;
      }

      cardset.cards.push(Object.assign({
        selected: false
      }, card));
    });

    let result = [];
    collated.forEach(cardset => {
      if (cardset.cards.length > 0) {
        result.push(cardset);
      }
    });

    return result;
  },
  lesson_getDifficultCards() {
    let collated = {};

    cards.forEach(card => {
      if (card.group) {
        if (!collated[card.group]) {
          collated[card.group] = {
            id: card.group,
            options: []
          };
        }
        let option = {
          value: card.id,
          text: card.name
        };
        collated[card.group].options.push(option);
      }
    });

    let result = [];
    _.each(collated, item => {
      result.push(item);
    });
    return result;
  },
  lesson_getOptionalCards(state) {
    let result = [];

    cards.forEach(card => {
      let cardset = result[card.weight - 1];
      if (cardset === undefined) {
        cardset = {
          value: card.weight,
          name: getWeightName(card.weight),
          cards: []
        };
        result[card.weight - 1] = cardset;
      }

      if (card.group) {
        if (state.difficulties[card.group] != card.id) {
          return;
        }
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