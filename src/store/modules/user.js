import config from "js/config.js";
import api from "api";
import Vue from "vue";

const state = {
  authenticated: false,
  username: "",
  nickname: "",
  portrait: 0
};

function obtain(user) {
  if (config.debug) {
    // user.grade.lv = 20;
    // user.level = "70";
  }

  Vue.set(state, "grade", user.grade);
  Object.assign(state, user);
}

const mutations = {
  user_assignAuth(state, user) {
    // console.log(user);
    state.authenticated = true;
    obtain(user);
  },
  user_setAuth(state, user) {
    state.authenticated = true;
    obtain(user);
    localStorage.user = JSON.stringify(user);
  },
  user_deleteAuth(state) {
    state._id = null;
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
