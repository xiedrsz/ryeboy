import * as types from "store/mutation-types";

const state = {
  title: "",
  loading: false,
  dialog: {
    show: false,
    type: "alert",
    title: "",
    content: ""
  }
};

const mutations = {
  [types.SET_PAGE_TITLE](state, title) {
    state.title = title;
  },
  [types.SHOW_LOADING](state, show) {
    state.loading = show;
  },
  [types.SHOW_DIALOG](state, data) {
    Object.assign(state.dialog, data);
  }
};

export default {
  state,
  mutations
};