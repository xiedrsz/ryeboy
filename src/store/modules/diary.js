import Vue from "vue";
import api from "api";
import _ from "lodash";
import * as types from "store/mutation-types";

const config = require("js/config.js");
const datetime = require("js/utils/datetime.js");
const textHelper = require("js/utils/textHelper.js");
const pageSize = 10;

const state = {
  // 默认频道
  channels: [
    {
      id: "default",
      name: "全部",
      active: false
    },
    {
      id: "tbs",
      name: "蜕变史",
      active: false
    },
    {
      id: "ms",
      name: "麦式",
      active: false
    },
    {
      id: "ys",
      name: "饮食",
      active: false
    },
    {
      id: "zx",
      name: "作息",
      active: false
    },
    {
      id: "xl",
      name: "心理",
      active: false
    },
  ],

  // 当前选择的频道
  activedChannel: null,

  // 每个频道的数据，包括状态、日记列表等
  channelDatas: {},

  // 日记用户表
  users: {}
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
    if (data.loadstate) {
      state.channelDatas[label].loadstate = data.loadstate;
    }
    if (data.diaries) {
      data.diaries.forEach(item => {
        state.channelDatas[label].diaries.push(item);
      });
    }
  },
};

const actions = {
  async getMoreDiaries({
    commit,
    state
  }) {
    let label = state.activedChannel;
    let channelData = state.channelDatas[label];
    let result = {};

    if (!channelData) {
      result.error = "unload";
      return result;
    }

    let filter = channelData.activedFilter;

    try {
      let res = await api.getDiaries(label, filter, _.last(channelData.diaries).createdAt);
      let diaries = res.data;
      let users = getUnstoredUsers(diaries);
      if (users.length > 0) {
        res = await api.getUsers(users);
        addUsers(res.data);
      }
      updateDiaries(diaries);

      commit(types.SET_CHANNEL_DATA, {
        label,
        diaries
      });

      result.nomore = diaries.length < pageSize;
    } catch (error) {
      result.error = error;
    }

    return result;
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
        enableLoadMore: false,
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
      loadstate: "loading"
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
        loadstate: diaries.length == 0 ? "empty" : "ok",
        diaries
      });

      return diaries.length < pageSize;
    } catch (error) {
      commit(types.SET_CHANNEL_DATA, {
        label,
        loadstate: "error"
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