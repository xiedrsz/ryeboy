import * as types from "store/mutation-types";

const state = {
  title: "",
  loading: false
};

const mutations = {
  [types.SET_PAGE_TITLE](state, title) {
    state.title = title;
  },
  [types.SHOW_LOADING](state, show) {
    state.loading = show;
  }
};

export default {
  state,
  mutations
};