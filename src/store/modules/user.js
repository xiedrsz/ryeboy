import config from "js/config.js";
import api from "api";

const state = {
  authenticated: false
};

const mutations = {
  user_assignAuth(state, user) {
      if (config.debug) {
        user.grade.lv = 20;
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

const actions = {
  // 获取用户信息
  async getUser({
    commit
  }, option) {
    let userId = option.userId,
      callback = option.callback,
      res = await api.getUser(userId)

    !!callback && callback(res.data);
  }
};

export default {
  state,
  mutations,
  actions
};