import config from "js/config.js";
import storage from "js/utils/storage.js";
import _ from "lodash";
import api from "api";
import Vue from "vue";

const state = {
  authenticated: false,
  username: "",
  nickname: "",
  portrait: 0,
  grade: {
    lv: 1,
    exp: 0
  },
};

function obtain(user) {
  if (config.debug) {
    // user.grade.lv = 20;
    // user.level = "70";
  }

  if (_.isEmpty(user.grade)){
    delete user.grade;
  }

  Object.assign(state, user);

  let avatar = require("img/default-avatar.png");
  if (state.portrait) {
    avatar = `${config.ossAddress}/portraits/${state._id}_${state.portrait}.jpg`;
  }
  Vue.set(state, "avatar", avatar);
}

const mutations = {
  user_assignAuth(state, user) {
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
  },
  user_updateInfo(state, data) {
    let {
      name,
      content
    } = data;
    Vue.set(state, name, content);

    if (name == "nickname") {
      let user = JSON.parse(localStorage.user);
      user[name] = content;
      localStorage.user = JSON.stringify(user);
    }
  }
};

const actions = {
  async user_getNewMessageCount({
    state
  }) {
    if (!state.authenticated) {
      return;
    }

    let key = `${state._id}_fetchTime`;
    let fetchTime = storage.getObject(key, {
      notice: {
        comment: new Date(),
        system: new Date()
      }
    });
    Vue.set(state, "fetchTime", fetchTime);

    let {
      data
    } = await api.getNewMessageCount(state._id, fetchTime);

    Vue.set(state, "messageCount", data);
  },

  async user_loadConfig({
    state,
    rootState
  }) {
    // try {
    //   let data = (await api.loadServerConfig()).data;
    // } catch (error) {

    // }
  },

  async user_getCards({
    state
  }) {
    let cards = _.keyBy((await api.getUserCards(state._id)).data, "id");
    Vue.set(state, "cards", cards);
  },
    
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
