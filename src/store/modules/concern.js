import Vue from "vue";
import api from "api";
import _ from "lodash";

const config = require("js/config.js");
const datetime = require("js/utils/datetime.js");
const textHelper = require("js/utils/textHelper.js");

// 关注动态初始位置
let last = 0;

/**
 * @Description 筛选出 state 中未有的用户数据，以便获取
 * @Param list 数据源列表, 如： 关注动态
 * @Return Array userid数组
 */
function getUnmappedUsers(list) {
  let result = [];
  let userid;
  _.forEach(list, item => {
    userid = item.userid;
    !!userid && (state.users[userid] === undefined) && (result.push(userid));
  });
  return result;
}

/**
 * @Description 为 state 中的 user 对象添加用户信息
 * @Param users 数据源列表
 */
function addUsers(users) {
  _.forEach(users, user => {
    user.username = textHelper.getUserName(user);
    user.userlv = textHelper.getUserLevel(user);
    user.verified = user.level == "70";
    if (user.portrait) {
      user.avatar = `${config.ossAddress}/portraits/${user._id}_${user.portrait}.jpg`;
    } else {
      user.avatar = require("img/default-avatar.png");
    }

    state.users[user._id] = user;
  });
}

function updateDairy(diaries) {
  _.forEach(diaries, diary => {
    let pictures = [];
    if (diary.pictures) {
      diary.pictures.forEach(item => {
        pictures.push(textHelper.getPictureUrl(item));
      });
    }
    diary.pictures = pictures;

    diary.time = datetime.formatDiaryCreated(diary.created_at);
    diary.dateWithoutYear = datetime.formatDiaryDateWithoutYear(diary.date);
    diary.week = datetime.formatDiaryWeek(diary.date);
    diary.escapedText = textHelper.escape(textHelper.getDiaryText(diary));
  })
}

/**
 * @Description 为列表插入用户信息
 * @Param list 数据源
 */
function addMap(list) {
  let userid;
  let _id;
  _.forEach(list, item => {
    userid = item.userid;
    _id = item._id;
    _.assign(item, state.users[userid]);
    item._id = _id
  });
}

const state = {
  // 用户映射表
  users: {},
  // 关注 概述
  overview: [
    {
      path: "/dynamic/concern/dynamic",
      name: "关注动态"
    },
    {
      path: "/dynamic/concern/concern",
      name: "关注"
    },
    {
      path: "/dynamic/concern/fans",
      name: "粉丝"
    }
  ],
  // 关注 动态
  dynamic: [],
  // 关注 关注列表
  concern: [],
  // 关注 粉丝
  fans: [],
  // 新 关注人列表
  newconcern: [],
  // loading 组件
  loading: {
    no: false,
    err: false,
    none: false,
    icon: true
  }
};

const getters = {
  /*getChannelLoadstate(state) {
    let result;
    try {
      let channelData = state.channelDatas[state.activedChannel];
      result = channelData.loadstate;
    } catch (error) {
      result = "unload";
    }
    return result;
  }*/
};

const mutations = {
  /**
   * @Description 设置概述
   * @Param obj [eg:{cons: 50, fans: 50}]
   */
  concern_setOverview(state, obj) {
      state.overview[1].name = "关注" + obj.followeeCount;
      state.overview[2].name = "粉丝" + obj.followerCount;
    },
    /**
     * @Description 添加 动态
     * @Param list Array 动态列表
     */
    concern_addDynamic(state, option) {
      let list = option.list;
      let addType = option.addType;
      state.dynamic[addType].apply(state.dynamic, list);
    },
    /**
     * @Function 添加关注人
     * @Param list Array 关注人列表
     * @Note checked 在邀请好友那用到
     */
    concern_addConcern(state, list) {
      state.concern = _.map(list, item => {
        item.checked = false;
        return item;
      });

      /*list.forEach((item) => {
        state.concern.push(item)
      });*/
    },
    /**
     * @Function 清除暂留关注人
     */
    concern_filterConcern(state, list) {
      let userids = {};
      let userid;
      // 清除关注者
      state.concern = _.filter(state.concern, (item) => {
        if (item.note === "取消") {
          return true;
        } else {
          userid = item.userid;
          userids[userid] = true;
          return false;
        }
      });
      // 清楚动态
      state.dynamic = _.filter(state.dynamic, item => {
        userid = item.userid;
        if (userids[userid]) {
          return false;
        }
        return true;
      });
    },
    /**
     * @Function 添加关注人
     * @Param list Array 粉丝列表
     */
    concern_addFans(state, list) {
      list.forEach((item) => {
        state.fans.push(item)
      });
    },
    /**
     * @Function 初始化新关注人列表
     * @Param list Array 关注人列表
     */
    concern_initNewConcern(state, list) {
      state.newconcern = list;
    },
    /**
     * @function 点赞
     * @Param id String 日记id
     */
    concern_like(state, id) {
      let tmp = _.filter(state.dynamic, {
        id
      });
      _.forEach(tmp, item => {
        item.likeCount++;
        item.likeIt = true;
      })
    },
    /**
     * @function 评论
     * @Param id String 日记id
     */
    concern_comment(state, id) {
      let tmp = _.filter(state.dynamic, {
        id
      });
      _.forEach(tmp, item => {
        item.commentCount++;
      })
    },
    /**
     * @function 取消关注
     * @Param opt Object 修改选项 {index: 索引, type: concern/newconcern}
     */
    concern_cancel(state, opt) {
      let index = opt.index,
        type = opt.type || "concern";

      state[type][index].note = "关注";
    },
    /**
     * @function 添加关注
     * @Param opt Object 修改选项 {index: 索引, type: concern/newconcern}
     */
    concern_add(state, opt) {
      let index = opt.index,
        type = opt.type || "concern",
        note = type == "concern" ? "取消" : "已关注";

      state[type][index].note = note;
    },
    /**
     * @function 修改 loading 选项
     * @Param opt Object 新变化
     */
    save_loading(state, opt) {
      _.assign(state.loading, opt)
    },
    /**
     * @function 邀请 好友item
     * @Param item Object 
     */
    concern_checked(state, item) {
      let id = item.id;
      let checked = item.checked;
      let temp = _.filter(state.concern, {
        id
      });
      _.forEach(temp, item => {
        item.checked = !checked;
      })
    }
};

const actions = {
  async getOverview({
      commit,
      rootState
    }) {
      let res = await api.getFansNum(),
        obj = res.data;
      commit("concern_setOverview", obj);
    },

    // 关注， 获取日记， 基本完成，等待数据
    async getDynamic({
      commit,
      state
    }, option = {}) {
      let addType = option.addType || 'push';
      let infiniteScroll = option.infiniteScroll;

      !infiniteScroll && commit("save_loading", {
        no: false,
        err: false,
        none: false,
        icon: true
      });

      let list = [];
      let len;

      await api.getDynamicDiaries(last).then((res) => {
        !!res && (list = res.data);
      }).catch(() => {
        commit("save_loading", {
          err: true
        });
        !!infiniteScroll && infiniteScroll.$emit("$InfiniteScroll:complete");
      });

      // 加入用户资料
      let users = getUnmappedUsers(list);
      let resTmp;
      if (users.length > 0) {
        resTmp = await api.getUsers(users);
        addUsers(resTmp.data);
      }
      addMap(list);
      updateDairy(list);

      commit("concern_addDynamic", {
        list,
        addType
      });
      len = list.length;
      last += len;
      if (len < 20) {
        !!infiniteScroll && infiniteScroll.$emit("$InfiniteScroll:complete");
      } else {
        !!infiniteScroll && infiniteScroll.$emit("$InfiniteScroll:loaded");
      }

      if (!state.dynamic[0]) {
        commit("save_loading", {
          none: true
        });
      }

      commit("save_loading", {
        icon: false
      });
    },

    // 点赞, 基本完成
    async like({
      commit
    }, diary_id) {
      await api.like(diary_id);
      commit('concern_like', diary_id);
    },

    // 评论, 基本完成
    async comment({
      commit
    }, option) {
      let id = option.id;
      await api.comment(id);
      commit('concern_comment', id);
    },

    // 获取关注人, 基本完成
    async getConcern({
      commit,
      state
    }) {
      commit("save_loading", {
        no: false,
        err: false,
        none: false,
        icon: true
      });

      let list = [];

      await api.getConcerns().then((res) => {
        !!res && (list = res.data);
      }).catch(() => {
        commit("save_loading", {
          err: true
        });
      });

      _.forEach(list, (item) => {
        item.note = "取消";
        item.userid = item.id;
      });

      // 加入用户资料
      let users = getUnmappedUsers(list);
      let resTmp;
      if (users.length > 0) {
        resTmp = await api.getUsers(users);
        addUsers(resTmp.data);
      }
      addMap(list);

      commit("concern_addConcern", list);

      if (!state.concern[0]) {
        commit("save_loading", {
          none: true
        });
      }

      commit("save_loading", {
        icon: false
      });
    },

    // 获取粉丝，基本完成
    async getFans({
      commit
    }) {
      commit("save_loading", {
        no: false,
        err: false,
        none: false,
        icon: true
      });

      let list = [];

      await api.getFans().then((res) => {
        !!res && (list = res.data);
      }).catch(() => {
        commit("save_loading", {
          err: true
        });
      });

      _.forEach(list, (item) => {
        item.userid = item.id;
      });

      // 加入用户资料
      let users = getUnmappedUsers(list);
      let resTmp;
      if (users.length > 0) {
        resTmp = await api.getUsers(users);
        addUsers(resTmp.data);
      }
      addMap(list);

      commit("concern_addFans", list);

      if (!state.fans[0]) {
        commit("save_loading", {
          none: true
        });
      }

      commit("save_loading", {
        icon: false
      });
    },

    // 获取新关注人列表, 基本完成
    async getNewConcern({
      commit,
      state
    }) {
      commit("save_loading", {
        no: false,
        err: false,
        none: false,
        icon: true
      });

      let list = [];

      await api.getNewConcern().then((res) => {
        if (!!res.message) {
          commit("save_loading", {
            err: true
          });
        } else {
          list = res.data;
        }
      }).catch((err) => {
        commit("save_loading", {
          err: true
        });
      });

      _.forEach(list, (item) => {
        item.note = "关注";
        item.userid = item.id;
      });

      // 加入用户资料
      let users = getUnmappedUsers(list);
      let resTmp;
      if (users.length > 0) {
        resTmp = await api.getUsers(users);
        addUsers(resTmp.data);
      }
      addMap(list);

      commit("concern_initNewConcern", list);

      if (!state.newconcern[0]) {
        commit("save_loading", {
          none: true
        });
      }

      commit("save_loading", {
        icon: false
      });
    },

    // 取消关注, 基本完成
    async cancelConcern({
      dispatch,
      commit
    }, option) {
      // 关注人的ID
      let userId = option.userId;
      await api.cancelConcern(userId);
      commit('concern_cancel', option);
      dispatch("getOverview");
    },

    // 添加关注, 基本完成
    async addConcern({
      dispatch,
      commit
    }, option) {
      // 关注人的ID
      let userId = option.userId;
      await api.concern(userId);
      commit('concern_add', option);
      dispatch("getOverview");
    }
};

export default {
  state,
  mutations,
  actions,
  getters
};