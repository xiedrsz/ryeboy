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

function updateComments(comments) {
  comments.forEach(comment => {
    let user = state.users[comment.userid];
    if (user) {
      comment.username = textHelper.getUserName(user);
      comment.userlv = textHelper.getUserLevel(user);
      comment.verified = user.level == "70";
      if (user.portrait) {
        comment.avatar = `${config.ossAddress}/portraits/${user._id}_${user.portrait}.jpg`;
      } else {
        comment.avatar = require("img/default-avatar.png");
      }
    }

    // 回复的用户
    user = state.users[comment.reply];
    if (user) {
      comment.replied = "回复" + textHelper.getUserName(user) + ":";
    }

    comment.time = datetime.formatDiaryCreated(comment.createdAt);
    comment.escapedText = textHelper.escape(comment.content);
  });
}

function updateDiaries(diaries) {
  diaries.forEach(diary => {
    let user = state.users[diary.userid];
    if (user) {
      diary.username = textHelper.getUserName(user);
      diary.userlv = textHelper.getUserLevel(user);
      diary.verified = user.level == "70";
      if (user.portrait) {
        diary.avatar = `${config.ossAddress}/portraits/${user._id}_${user.portrait}.jpg`;
      } else {
        diary.avatar = require("img/default-avatar.png");
      }
    }

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
  getDiaryUsers(state) {
    return state.users;
  },

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
  diary_setLike(state, data) {
    _.each(state.channelDatas, channel => {
      channel.diaries.forEach(diary => {
        if (diary._id == data.id) {
          diary.like = data.like;
          if (data.like) {
            diary.likeCount++;
          } else {
            diary.likeCount--;
          }
        }
      });
    });
  },

  diary_setChannelChanged(state, changed) {
    state.channelChanged = changed === undefined ? true : changed;
  },

  diary_setDefaultChannels(state) {
    state.channels = _.clone(defaultSubscribedChannels);
    state.channels.forEach(item => {
      Vue.set(item, "active", false);
    });
  },

  diary_setChannels(state, data) {
    state.channels = _.clone(data.channels);
    state.channels.forEach(item => {
      Vue.set(item, "active", false);
    });
    // 确保有默认频道
    if (state.channels.length == 0) {
      state.channels.push(defaultSubscribedChannels[0]);
    } else if (state.channels[0].id != defaultSubscribedChannels[0].id) {
      state.channels.unshift(defaultSubscribedChannels[0]);
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
          channelData.diaries.push(item);
        });
      }
    }
  },
};

const actions = {
  updateComments(context, comments) {
    updateComments(comments);
  },

  updateDiaries(context, diaries) {
    updateDiaries(diaries);
  },

  async obtainUsers(context, data) {
    let users = getUnstoredUsers(data);
    if (users.length > 0) {
      let res = await api.getUsers(users);
      addUsers(res.data);
    }
  },

  async setSubscribedChannels({
    commit,
    rootState
  }, channels) {
    let userid = rootState.user._id;

    let _channels = JSON.parse(JSON.stringify(channels));
    commit("diary_setChannels", {
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
    commit,
    rootState
  }) {
    let userid = rootState.user._id;

    let key = `${userid}_channels`;
    if (localStorage[key]) {
      commit("diary_setChannels", {
        channels: JSON.parse(localStorage[key])
      });
    } else {
      commit("diary_setDefaultChannels");
    }
  },

  async getSubscribedChannels({
    commit,
    state,
    rootState
  }) {
    let userid = rootState.user._id;
    let key = `${userid}_channels`;

    try {
      let res = await api.getSubscribedChannels(userid);
      let channels = res.data;
      commit("diary_setChannels", {
        channels
      });
      localStorage[key] = JSON.stringify(state.channels);
    } catch (error) {
      if (localStorage[key]) {
        commit("diary_setChannels", {
          channels: JSON.parse(localStorage[key])
        });
      }
    }
  },

  async getMoreDiaries({
    commit,
    state,
    rootState
  }, infiniteScroll) {
    let label = state.activedChannel;
    let channelData = state.channelDatas[label];
    let userid = rootState.user._id;

    try {
      let filter = channelData.activedFilter;
      let res = await api.getDiaries(label, filter, _.last(channelData.diaries).createdAt, userid);
      let diaries = res.data;
      let users = getUnstoredUsers(diaries);
      if (users.length > 0) {
        res = await api.getUsers(users);
        addUsers(res.data);
      }
      updateDiaries(diaries);

      let nomore = diaries.length < config.pageSize;

      commit("diary_setChannelData", {
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
      console.log(diaries);
      let users = getUnstoredUsers(diaries);
      if (users.length > 0) {
        res = await api.getUsers(users);
        addUsers(res.data);
      }
      updateDiaries(diaries);

      commit("diary_setChannelData", {
        label,
        assign: {
          nomore: diaries.length < config.pageSize,
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