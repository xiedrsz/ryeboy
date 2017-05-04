const state = {
  authenticated: false,
  username: null,
  nickname: null
};

const mutations = {
  user_setAuth(state, user) {
    state.authenticated = true;
    Object.assign(state, user);
  },
  user_deleteAuth(state) {
    state.authenticated = false;
  }
};

export default {
  state,
  mutations
};