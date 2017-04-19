import Vue from "vue";
import api from "api";
import _ from "lodash";
import * as types from "store/mutation-types";

const config = require("js/config.js");
const datetime = require("js/utils/datetime.js");
const textHelper = require("js/utils/textHelper.js");
const pageSize = 10;

// 默认订阅频道
const defaultSubscribedChannels = [
  {
    id: "default",
    name: "全部"
  },
  {
    id: "tbs",
    name: "蜕变史"
  },
  {
    id: "ms",
    name: "麦式"
  },
  {
    id: "ys",
    name: "饮食"
  },
  {
    id: "zx",
    name: "作息"
  },
  {
    id: "xl",
    name: "心理"
  },
];

const state = {
  // 日记频道列表
  channels: [],

  // 当前选择的频道
  activedChannel: null,

  // 每个频道的数据，包括状态、日记列表等
  channelDatas: {},

  // 日记用户表
  users: {},

  // 日记频道修改标志
  channelChanged: false,
};


function getUnstoredUsers(data) {
  let result = [];
  data.forEach(item => {
    if (state.users[item.userid] === undefined) {
      result.push(item.userid);
    }
  });
  return result;
}

function addUsers(users) {
  users.forEach(user => {
    state.users[user._id] = user;
  });
}

function updateDiaries(diaries) {
  diaries.forEach(diary => {
    let user = state.users[diary.userid];
    if (user) {
      diary.username = textHelper.getUserName(user);
      if (user.portrait) {
        diary.avatar = `${config.ossAddress}/portraits/${user._id}_${user.portrait}.jpg`;
      } else {
        diary.avatar = "../../img/default-avatar.png";
      }
    }
    diary.time = datetime.formatDiaryCreated(diary.createdAt);
    diary.escapedText = textHelper.escape(textHelper.getDiaryText(diary));
  });
}

const getters = {
  getChannelLoadstate(state) {
    let result;
    try {
      let channelData = state.channelDatas[state.activedChannel];
      result = channelData.loadstate;
    } catch (error) {
      result = "unload";
    }
    return result;
  }
};

const mutations = {
  [types.SET_CHANNEL_CHANGED](state, changed) {
    state.channelChanged = changed === undefined ? true : changed;
  },

  [types.SET_DEFAULT_CHANNELS](state) {
    state.channels = _.clone(defaultSubscribedChannels);
  },

  [types.SET_CHANNELS](state, data) {
    // console.log(data.channels);
    state.channels = _.clone(data.channels);
    // 确保有默认频道
    if (state.channels.length == 0) {
      state.channels.push(defaultSubscribedChannels[0]);
    } else if (state.channels[0].id != defaultSubscribedChannels[0].id) {
      state.channels.unshift(defaultSubscribedChannels[0]);
    }
  },

  [types.SWITCH_CHANNEL](state, label) {
    state.activedChannel = label;
    state.channels.forEach(item => {
      item.active = item.id == label;
    });
  },

  [types.SWITCH_FILTER](state, data) {
    let channelData = state.channelDatas[state.activedChannel];
    if (channelData.loadstate == "loading") {
      return;
    }
    if (channelData.loadstate == "ok" && channelData.activedFilter == data.filter) {
      return;
    }
    channelData.activedFilter = data.filter;
    if (data.reload) {
      channelData.loadstate = "reload";
      channelData.diaries = [];
    }
    channelData.filters.forEach(item => {
      item.active = item.id == data.filter;
    });
  },

  [types.CLEAR_CHANNEL_DATA](state) {
    state.channelDatas = {};
  },

  [types.SET_RELOAD](state) {
    let channelData = state.channelDatas[state.activedChannel];
    channelData.loadstate = "reload";
    channelData.diaries = [];
  },

  [types.ASSIGN_CHANNEL_DATA](state, data) {
    Vue.set(state.channelDatas, state.activedChannel, data);
  },

  [types.SET_CHANNEL_DATA](state, data) {
    let label = data.label;
    let channelData = state.channelDatas[label];
    if (channelData) {
      if (data.assign) {
        Object.assign(channelData, data.assign);
      }
      if (data.diaries) {
        data.diaries.forEach(item => {
          channelData.diaries.push(item);
        });
      }
    }
  },
};

const actions = {
  async setSubscribedChannels({
    commit,
    rootState
  }, channels) {
    let userid = rootState.user.id;

    let _channels = JSON.parse(JSON.stringify(channels));
    commit(types.SET_CHANNELS, {
      channels: _channels
    });
    localStorage[`${userid}_channels`] = JSON.stringify(_channels);

    try {
      await api.setSubscribedChannels(userid, _channels);
    } catch (error) {
      console.log(error);
    }
  },

  async initSubscribedChannels({
    commit
  }) {
    let key = `${localStorage.userid}_channels`;
    if (localStorage[key]) {
      commit(types.SET_CHANNELS, {
        channels: JSON.parse(localStorage[key])
      });
    } else {
      commit(types.SET_DEFAULT_CHANNELS);
    }
  },

  async getSubscribedChannels({
    commit,
    state,
    rootState
  }) {
    let userid = rootState.user.id;
    let key = `${userid}_channels`;

    try {
      let res = await api.getSubscribedChannels(userid);
      let channels = res.data;
      commit(types.SET_CHANNELS, {
        channels
      });
      localStorage[key] = JSON.stringify(state.channels);
    } catch (error) {
      if (localStorage[key]) {
        commit(types.SET_CHANNELS, {
          channels: JSON.parse(localStorage[key])
        });
      }
    }
  },

  async getMoreDiaries({
    commit,
    state
  }, infiniteScroll) {
    let label = state.activedChannel;
    let channelData = state.channelDatas[label];

    try {
      let filter = channelData.activedFilter;
      let res = await api.getDiaries(label, filter, _.last(channelData.diaries).createdAt);
      let diaries = res.data;
      let users = getUnstoredUsers(diaries);
      if (users.length > 0) {
        res = await api.getUsers(users);
        addUsers(res.data);
      }
      updateDiaries(diaries);

      let nomore = diaries.length < pageSize;

      commit(types.SET_CHANNEL_DATA, {
        label,
        assign: {
          nomore
        },
        diaries
      });

      if (nomore) {
        infiniteScroll.$emit("$InfiniteScroll:complete");
      } else {
        infiniteScroll.$emit("$InfiniteScroll:loaded");
      }
    } catch (error) {
      infiniteScroll.$emit("$InfiniteScroll:complete");
    }
  },

  async getDiaries({
    commit,
    state
  }) {
    let label = state.activedChannel;
    let filter = "recommend";
    let channelData = state.channelDatas[label];

    if (channelData) {
      switch (channelData.loadstate) {
      case "loading":
      case "ok":
      case "empty":
        return;
      }

      filter = channelData.activedFilter;
    } else {
      channelData = {
        activedFilter: filter,
        loadstate: null,
        nomore: true,
        filters: [{
          id: "recommend",
          name: "精品",
          active: false
        },
        {
          id: "latest",
          name: "最新",
          active: false
        },
        {
          id: "hot",
          name: "最热",
          active: false
        },
        {
          id: "cold",
          name: "最冷",
          active: false
        }],
        diaries: []
      };
      commit(types.ASSIGN_CHANNEL_DATA, channelData);
      commit(types.SWITCH_FILTER, {
        filter
      });
    }

    commit(types.SET_CHANNEL_DATA, {
      label,
      assign: {
        loadstate: "loading"
      }
    });

    try {
      let res = await api.getDiaries(label, filter);
      let diaries = res.data;
      let users = getUnstoredUsers(diaries);
      if (users.length > 0) {
        res = await api.getUsers(users);
        addUsers(res.data);
      }
      updateDiaries(diaries);

      commit(types.SET_CHANNEL_DATA, {
        label,
        assign: {
          nomore: diaries.length < pageSize,
          loadstate: diaries.length == 0 ? "empty" : "ok",
        },
        diaries
      });
    } catch (error) {
      commit(types.SET_CHANNEL_DATA, {
        label,
        assign: {
          loadstate: "error"
        }
      });
    }
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};