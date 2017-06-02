import config from "js/config.js";

const state = {
  authenticated: false
};

const mutations = {
  user_assignAuth(state, user) {
    if (config.debug) {
      // user.grade.lv = 20;
    }

    state.authenticated = true;
    Object.assign(state, user);
  },
  user_setAuth(state, user) {
    state.authenticated = true;
    Object.assign(state, user);
    localStorage.user = JSON.stringify(user);
  },
  user_deleteAuth(state) {
    state.authenticated = false;
  }
};

export default {
  state,
  mutations
};