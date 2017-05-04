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
  unselected: [],
  selectedDifficulties: {
    "304": 304,
    "401": 401,
    "411": 411
  }
};

const getters = {
  lesson_getCards() {
    return cards;
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
        if (state.selectedDifficulties[card.group] != card.id) {
          return;
        }
      }

      cardset.cards.push(Object.assign({
        selected: false
      }, card));
    });

    return result;
  } 
};

const mutations = {

};

export default {
  state,
  mutations,
  getters
};