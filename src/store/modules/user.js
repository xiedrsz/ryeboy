import * as types from "store/mutation-types";

const state = {
  authenticated: false,
  username: null,
  nickname: null
};

const mutations = {
  [types.SET_USER_AUTH](state, user) {
    state.authenticated = true;
    Object.assign(state, user);
  },
  [types.DELETE_USER_AUTH](state) {
    state.authenticated = false;
  }
};

export default {
  state,
  mutations
};