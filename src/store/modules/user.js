const state = {
  authenticated: false,
  username: null,
  nickname: null
};

const mutations = {
  setUserAuth(state, user) {
    state.authenticated = true;
    Object.assign(state, user);
  },
  deleteUserAuth(state) {
    state.authenticated = false;
  }
};

export default {
  state,
  mutations
};