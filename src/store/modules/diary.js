import Vue from "vue";
import api from "api";
import _ from "lodash";

const config = require("js/config.js");
const datetime = require("js/utils/datetime.js");
const textHelper = require("js/utils/textHelper.js");

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
  // 日记用户映射表
  users: {},

  // 日记数据映射表
  map: {},

  // 日记频道列表
  channels: [],

  // 当前选择的频道
  activedChannel: null,

  // 每个频道的数据，包括状态、日记列表等
  channelDatas: {},

  // 每个用户的日记数据
  userDatas: {},

  // 点赞数据
  likeDatas: {},

  // 日记频道修改标志
  channelChanged: false,
};


function getUnmappedUsers(data) {
  let result = [];
  data.forEach(item => {
    if (item.userid) {
      if (state.users[item.userid] === undefined) {
        result.push(item.userid);
      }
    }
  });
  return result;
}

function addUsers(users) {
  users.forEach(user => {
    state.users[user._id] = user;
  });
}

function addMap(diaries) {
  let result = [];

  diaries.forEach(diary => {
    let mapped = state.map[diary._id];
    if (mapped) {
      Object.keys(diary).forEach(prop => {
        if (!mapped.hasOwnProperty(prop)) {
          Vue.set(mapped, prop, diary[prop]);
          delete diary[prop];
        }
      });
      Object.assign(mapped, diary);
    } else {
      Vue.set(state.map, diary._id, diary);
    }

    result.push(state.map[diary._id]);
  });

  return result;
}

function updateUserInfo(items) {
  items.forEach(item => {
    let user = state.users[item.userid];
    if (user) {
      item.username = textHelper.getUserName(user);
      item.userlv = textHelper.getUserLevel(user);
      item.verified = user.level == "70";
      if (user.portrait) {
        item.avatar = `${config.ossAddress}/portraits/${user._id}_${user.portrait}.jpg`;
      } else {
        item.avatar = require("img/default-avatar.png");
      }
    }
  });
}

function updateComments(comments) {
  updateUserInfo(comments);
  comments.forEach(comment => {
    let user = state.users[comment.reply];
    if (user) {
      comment.replied = "回复" + textHelper.getUserName(user) + ":";
    }

    comment.time = datetime.formatDiaryCreated(comment.createdAt);
    comment.escapedText = textHelper.escape(comment.content);
  });
}

function updateData(diaries) {
  updateUserInfo(diaries);
  diaries.forEach(diary => {
    let pictures = [];
    if (diary.pictures) {
      diary.pictures.forEach(item => {
        pictures.push(textHelper.getPictureUrl(item));
      });
    }
    diary.pictures = pictures;

    diary.time = datetime.formatDiaryCreated(diary.createdAt);
    diary.dateWithoutYear = datetime.formatDiaryDateWithoutYear(diary.date);
    diary.week = datetime.formatDiaryWeek(diary.date);
    diary.escapedText = textHelper.escape(textHelper.getDiaryText(diary));
  });
}

const getters = {
  diary_users(state) {
    return state.users;
  }
};

const mutations = {
  diary_setChannelChanged(state, changed) {
    state.channelChanged = changed === undefined ? true : changed;
  },

  diary_setChannels(state, data) {
    let channels = _.cloneDeep(data.channels);
    channels.forEach(item => {
      item.active = false;
      if (!item.id) {
        item.id = item.name;
        item.name = item.displayName;
      }
    });
    Vue.set(state, "channels", channels);

    // 确保有默认频道
    let channel = _.cloneDeep(defaultSubscribedChannels[0]);
    if (state.channels.length == 0) {
      state.channels.push(channel);
    } else if (state.channels[0].id != channel.id) {
      state.channels.unshift(channel);
    }
  },

  diary_switchChannel(state, label) {
    state.activedChannel = label;
    state.channels.forEach(item => {
      item.active = item.id == label;
    });
  },

  diary_switchFilter(state, data) {
    let channelData = state.channelDatas[state.activedChannel];
    if (channelData.loadstate == "loading") {
      return;
    }
    if (channelData.loadstate == "loaded" && channelData.activedFilter == data.filter) {
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

  diary_clearChannelData(state) {
    state.channelDatas = {};
  },

  diary_setReload(state) {
    let channelData = state.channelDatas[state.activedChannel];
    channelData.loadstate = "reload";
    channelData.diaries = [];
  },

  diary_assignChannelData(state, data) {
    Vue.set(state.channelDatas, state.activedChannel, data);
  },

  diary_setChannelData(state, data) {
    let label = data.label;
    let channelData = state.channelDatas[label];
    if (channelData) {
      if (data.assign) {
        Object.assign(channelData, data.assign);
      }
      if (data.diaries) {
        data.diaries.forEach(item => {
          let diary = state.map[item._id];
          channelData.diaries.push(diary);
        });
      }
    }
  },
};

const actions = {
  diary_getUserData({
    state
  }, {
    userid,
    label
  }) {
    let userDatas = state.userDatas;
    let data;

    if (!userDatas[userid]) {
      Vue.set(userDatas, userid, {
        index: 0,
        viewType: "daily"
      });
    }
    data = userDatas[userid];

    if (label) {
      if (!data[label]) {
        Vue.set(data, label, {
          diaries: [],
          loadstate: "loading",
          nomore: true,
          last: Date
        });
      }
      return data[label];
    } else {
      return data;
    }
  },

  diary_resetLikeData({
    state
  }, id) {
    let likeDatas = state.likeDatas;
    likeDatas[id] = undefined;
  },

  diary_getLikeData({
    state
  }, id) {
    let likeDatas = state.likeDatas;
    if (!likeDatas[id]) {
      Vue.set(likeDatas, id, {
        items: [],
        loadstate: "loading",
        nomore: true,
        last: 0
      });
    }
    return likeDatas[id];
  },

  diary_getDataById({
    state
  }, id) {
    return state.map[id];
  },

  diary_updateUserInfo(context, items) {
    updateUserInfo(items);
  },

  diary_updateComments(context, comments) {
    updateComments(comments);
  },

  diary_updateData(context, diaries) {
    updateData(diaries);
  },

  diary_addMap(context, diaries) {
    return addMap(diaries);
  },

  async diary_ensureUsers(context, data) {
    let users = getUnmappedUsers(data);
    if (users.length > 0) {
      let res = await api.getUsers(users);
      addUsers(res.data);
    }
  },

  async diary_setUserChannels({
    commit,
    rootState
  }, channels) {
    let userid = rootState.user._id;
    let key = `${userid}_channels`;

    commit("diary_setChannels", {
      channels 
    });
    localStorage[key] = JSON.stringify(channels);

    try {
      let data = _.map(channels, "id");
      await api.setUserChannels(userid, data);
    } catch (error) {
      console.log(error);
    }
  },

  async diary_getSubscribedChannels({
    commit,
    rootState
  }) {
    let {
      _id,
      authenticated
    } = rootState.user;

    // 未登录用户返回默认频道
    if (!authenticated) {
      commit("diary_setChannels", {
        channels: defaultSubscribedChannels
      });
      return;
    }

    let userid = _id;
    let key = `${userid}_channels`;

    // 从本地存储获取用户订阅频道
    if (localStorage[key]) {
      commit("diary_setChannels", {
        channels: JSON.parse(localStorage[key])
      });
      return;
    }

    // 远程获取用户订阅频道
    let channels = defaultSubscribedChannels;
    try {
      let res = await api.getSubscribedChannels(userid);
      channels = res.data;
      localStorage[key] = JSON.stringify(channels);
    } catch (error) {
      console.log(error);
    }
    commit("diary_setChannels", {
      channels
    });
  },

  async diary_getMoreData({
    commit,
    state,
    rootState
  }) {
    let label = state.activedChannel;
    let channelData = state.channelDatas[label];
    let userid = rootState.user._id;

    let filter = channelData.activedFilter;
    let res = await api.getDiaries(label, filter, _.last(channelData.diaries).createdAt, userid);
    let diaries = res.data;
    let users = getUnmappedUsers(diaries);
    if (users.length > 0) {
      res = await api.getUsers(users);
      addUsers(res.data);
    }
    updateData(diaries);
    addMap(diaries);

    let nomore = diaries.length < config.pageSize.normal;

    commit("diary_setChannelData", {
      label,
      assign: {
        nomore
      },
      diaries
    });
  },

  async diary_getData({
    commit,
    state,
    rootState
  }) {
    let label = state.activedChannel;
    let filter = "recommend";
    let channelData = state.channelDatas[label];
    let userid = rootState.user._id;

    if (channelData) {
      switch (channelData.loadstate) {
        case "loading":
        case "loaded":
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
      commit("diary_assignChannelData", channelData);
      commit("diary_switchFilter", {
        filter
      });
    }

    commit("diary_setChannelData", {
      label,
      assign: {
        loadstate: "loading"
      }
    });

    try {
      let res = await api.getDiaries(label, filter, null, userid);
      let diaries = res.data;
      let users = getUnmappedUsers(diaries);
      if (users.length > 0) {
        res = await api.getUsers(users);
        addUsers(res.data);
      }

      updateData(diaries);
      addMap(diaries);

      commit("diary_setChannelData", {
        label,
        assign: {
          nomore: diaries.length < config.pageSize.normal,
          loadstate: diaries.length == 0 ? "empty" : "loaded",
        },
        diaries
      });
    } catch (error) {
      commit("diary_setChannelData", {
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