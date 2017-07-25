import _ from "lodash";
import api from "api";
import Vue from "vue";
const config = require("js/config.js");

const state = {
  answers: {
    recommends: [],
    types: [],
    list: {}
  },
};

const mutations = {

};

const actions = {
  async search_getAnswers_data({
    state
  }, {
    type,
    context
  }) {
    let data = (await api.getAnswers(type, context.last)).data;
    data.forEach(item => {
      context.items.push(item);
    });

    if (data.length == 0) {
      context.nomore = true;
    } else {
      context.nomore = data.length < config.largePageSize;
      context.last = _.last(data).createdAt;
    }

    return data.length;
  },

  async search_getAnswers_logic({
    state,
    dispatch
  }, type) {
    let context = state.answers.list[type];
    if (["loaded", "empty"].includes(context.loadstate)) {
      return;
    }
    try {
      let count = await dispatch("search_getAnswers_data", {
        type,
        context
      });
      context.loadstate = count == 0 ? "empty" : "loaded";
    } catch (error) {
      context.loadstate = "error";
    }
  },

  async search_getAnswers({
    state,
    dispatch
  }, {
    type,
    defaultContext
  }) {
    if (!state.answers.list[type]) {
      Vue.set(state.answers.list, type, defaultContext);
    }
    return state.answers.list[type];
  },

  async search_getAnswerTypes({
    state
  }) {
    if (state.answers.types.length == 0) {
      state.answers.types = (await api.getAnswerTypes()).data;
    }

    return state.answers.types;
  },

  async search_getRecommendAnswers({
    state
  }) {
    if (state.answers.recommends.length == 0) {
      state.answers.recommends = (await api.getRecommendAnswers()).data;
    }

    return state.answers.recommends;
  }
};

export default {
  state,
  mutations,
  actions
};