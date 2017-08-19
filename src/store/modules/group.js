import Vue from "vue";
import api from "api";
import _ from "lodash";

const config = require("js/config.js");
const datetime = require("js/utils/datetime.js");
const textHelper = require("js/utils/textHelper.js");

let gLast = {
  newest: 0,
  hottest: 0,
  level: 0
};
let dLast = {
  recommend: 0,
  newest: 0,
  hottest: 0,
  coldest: 0,
  untouched: 0
};

// 默认小组列表分类
let defaultGroupChannels = [
  {
    id: "recommend",
    name: "精品"
  },
  {
    id: "newest",
    name: "最新"
  },
  {
    id: "hottest",
    name: "最热"
  },
  {
    id: "coldest",
    name: "评论数很少"
  },
  {
    id: "untouched",
    name: "我未评论"
  }
];

let defaultGroupClass = [
  {
    id: "newest",
    name: "最新"
  },
  {
    id: "hottest",
    name: "最热"
  },
  {
    id: "level",
    name: "等级从高到低"
  }
];

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

  // 小组列表
  groups: [],

  // 小组，没有更多
  gNomore: {
    newest: false,
    hottest: false,
    level: false
  },

  // 查找小组结果页
  searchList: [],

  // 小组临时信息，用于创建组时暂存
  groupInfoTmp: {
    // 默认
    level: "0",
    medal: "0",
    score: 0,

    // 缺少参数
    memNum: 1,
    memMax: 50,
    levelMax: 5,
    medalMax: 30
  },

  // 小组成员列表
  members: [],

  // 组群申请列表
  applys: [],

  // 小组日记
  groupDiaries: [],

  // 小组日记， 没有更多
  dNomore: {
    recommend: false,
    newest: false,
    hottest: false,
    coldest: false,
    untouched: false
  },

  // 花生小组信息，用于修改或查看小组信息
  groupInfo: {
    name: "",
    avatar: "",
    description: "",

    // 缺少参数
    memNum: 1,
    memMax: 50,
    levelMax: 5,
    medalMax: 30
  },

  // 已加入小组频道
  channels: defaultGroupChannels,

  // 小组频道列表
  groupClass: defaultGroupClass
};

const getters = {
  /**
   * @Description 获取小组消息（花生小组）列表
   * @Param label String 标签，比如: [精品、最新、...], 暂时废弃
   */
  getGroupDiaries(state) {
      let result = {},
        label = "",
        channels = state.channels,
        groupDiaries = state.groupDiaries;

      _.forEach(channels, (item) => {
        label = item.id;
        result[label] = _.filter(groupDiaries, {
          filter: label
        });
      });

      return result;
    },

    /**
     * @Description 获取小组消息（花生小组）列表
     * @Param label String 标签，比如: [精品、最新、...], 暂时废弃
     */
    getGroupList(state) {
      let result = {},
        label = "",
        groupClass = state.groupClass,
        groups = state.groups;

      _.forEach(groupClass, (item) => {
        label = item.id;
        result[label] = _.filter(groups, {
          filter: label
        });
      });

      return result
    }
};

const mutations = {
  /**
   * @Description 新增小组列表
   * @Param list Array 新小组列表
   */
  group_pushGroup(state, list) {
      list.forEach(item => {
        !!item.avatar && (item.avatar = config.apiAddress + item.avatar);
      });
      state.groups.push.apply(state.groups, list);
    },

    group_setGNomore(state, newst) {
      _.assign(state.gNomore, newst);
    },

    /**
     * @Description 初始化查询结果列表
     * @Param list Array 新小组列表
     */
    group_initSearchList(state, list) {
      state.searchList = list;
    },

    /**
     * @Description 暂存小组临时信息
     * @Param obj Object 新小组信息
     */
    group_saveTmp(state, obj) {
      _.assign(state.groupInfoTmp, obj);
    },

    /**
     * @Description 新增小组成员列表
     * @Param list Array 新小组成员列表
     */
    group_initMember(state, list) {
      state.members = list;
    },

    /**
     * @Description 修改小组成员
     * @Param obj Object 新成员 eg: { _id: xx, ... }
     */
    group_saveMember(state, obj) {
      let id = obj.id;
      let tmp = _.filter(state.members, {
        id
      });
      _.forEach(tmp, item => {
        _.assign(item, obj);
      });
    },

    /**
     * @Description 新增组群申请列表
     * @Param list Array 新小组成员列表
     */
    group_pushApplys(state, list) {
      state.applys.push.apply(state.applys, list);
    },

    /**
     * @Description 修改申请列表
     * @Param obj Object 新申请对象 eg: { _id: xx, ... }
     */
    group_saveApplys(state, obj) {
      let id = obj.id;
      let tmp = _.filter(state.applys, {
        id
      });
      _.forEach(tmp, item => {
        _.assign(item, obj);
      });
    },

    /**
     * @Description 新增小组消息（花生小组）列表
     * @Param list Array 新小组成员列表
     */
    group_pushDiaries(state, list) {
      state.groupDiaries.push.apply(state.groupDiaries, list);
    },

    group_setdNomore(state, newst) {
      _.assign(state.dNomore, newst);
    },

    /**
     * @Description 修改小组日记
     * @Param obj Object 新日记信息 eg: { _id: xx, ... }
     */
    group_saveDiaries(state, obj) {
      let _id = obj._id;
      let tmp = _.filter(state.groupDiaries, {
        _id
      });
      _.forEach(tmp, item => {
        _.assign(item, obj);
      });
    },

    /**
     * @Description 暂存小组资料
     * @Param obj Object 新小组资料
     */
    group_saveInfo(state, obj) {
      _.assign(state.groupInfo, obj);
    },

    /**
     * @Description 修改小组列表
     * @Param obj Object 新小组资料 eg:{ _id: xx, ... }
     */
    group_saveGroups(state, obj) {
      let id = obj.id;
      let tmp = _.filter(state.groups, {
        _id: id
      });
      _.forEach(tmp, item => {
        _.assign(item, obj);
      });
    }
};

const actions = {
  // 获取小组列表, 基本完成
  async getGroups({
      commit,
      rootState
    }, option) {
      let filter = option.filter;
      let last = gLast[filter];
      let res = await api.getGroups(filter, last);
      let groups = res.data;
      let defInfo = {
        note: "加入",
        filter,

        // 补，后期要删除
        memNum: 1,
        memMax: 50,
        levelMax: 5,
        medalMax: 30
      };
      let myGroupId = rootState.user.groupId;
      !!myGroupId && (defInfo.note = '');

      _.forEach(groups, (item) => {
        _.assign(item, defInfo);
        (item._id === myGroupId) && (item.note = '已加入');
      });

      let nomore = {};
      nomore[filter] = groups.length < config.pageSize.normal;
      !nomore[filter] && (gLast[filter] += 20);
      commit("group_setGNomore", nomore);
      commit("group_pushGroup", res.data);
    },

    // 加入小组, 基本完成
    async addGroup({
      commit
    }, option) {
      let groupId = option.groupId,
        userId = option.userId,
        res = await api.addGroup(groupId, userId);

      commit("group_saveGroups", {
        id: groupId,
        note: "已申请"
      });
    },

    // 查找小组
    async searchGroup({
      commit
    }) {
      let res = await api.searchGroup();
      commit("group_initSearchList", res);
    },

    // 创建小组
    async createGroup({
      commit,
      state
    }, option) {
      let callback = option.callback,
        res = await api.createGroup(state.groupInfoTmp);

      !!res.data.group._id && callback && callback(res.data.group);
    },

    // 获取小组成员, 基本完成
    async getMembers({
      commit,
      state
    }, option) {
      let groupId = option.groupId;
      let orderBy = option.orderBy;
      let res = await api.getMembers(groupId, orderBy);

      // 当前用户是组长
      if (true) {
        _.forEach(res.data, (item) => {
          _.assign(item, {
            statusMsg: "清退"
          });
        });
      }

      commit("group_initMember", res.data);
    },

    // 清退成员, 基本完成
    async expellMember({
      commit,
      state
    }, option) {
      let groupId = state.groupInfo._id,
        userId = option.userId;

      let res = await api.expellMember(groupId, userId);
      commit("group_saveMember", {
        id: userId,
        statusMsg: "已清退"
      });
    },

    // 获取申请列表, 基本完成
    async getApplys({
      commit,
      state
    }, option) {
      let groupId = state.groupInfo._id;
      let res = await api.getApplys(groupId);
      let list = res.data;

      _.forEach(list, item => {
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

      commit("group_pushApplys", list);
    },

    // 同意申请, 基本完成
    async agreeApply({
      commit,
      state
    }, option) {
      let groupId = state.groupInfo._id;
      let uesrId = option.uesrId;
      let callback = option.callback;
      let res = await api.agreeApply(groupId, uesrId);

      commit("group_saveApplys", {
        id: uesrId,
        approved: true
      });
    },

    // 拒绝申请, 基本完成
    async rejectApply({
      commit,
      state
    }, option) {
      let groupId = state.groupInfo._id;
      let uesrId = option.uesrId;
      let res = await api.rejectApply(groupId, uesrId);

      commit("group_saveApplys", {
        id: uesrId,
        rejected: true
      });
    },

    // 获取小组日记, 基本完成
    async getGroupDiaries({
      commit,
      rootState
    }, option) {
      let id = rootState.user.groupId;
      let filter = option.filter;
      let last = dLast[filter];
      let res = await api.getGroupDiaries(id, filter, last);
      let diaries = res.data.diaries;

      // 加入用户资料
      let users = getUnmappedUsers(diaries);
      let resTmp;
      if (users.length > 0) {
        resTmp = await api.getUsers(users);
        addUsers(resTmp.data);
      }
      addMap(diaries);
      updateDairy(diaries);

      _.forEach(diaries, item => {
        item.filter = filter;
      });

      let nomore = {};
      nomore[filter] = diaries.length < config.pageSize.normal;
      !nomore[filter] && (dLast[filter] += 20);
      commit("group_setdNomore", nomore);
      commit("group_pushDiaries", diaries);
    },

    // 点赞, 基本完成
    async groupLike({
      commit,
      state
    }, option) {
      let _id = option._id;
      await api.like(_id);

      option.likeCount++;
      option.likeIt = true;
      commit("group_saveDiaries", option);
    },

    // 评论, 基本完成
    async groupComment({
      commit
    }, option) {
      let _id = option._id;
      await api.comment(_id);
      option.commentCount++;
      commit('group_saveDiaries', option);
    },

    // 获取小组资料, 基本完成
    async getGroupInfo({
      commit
    }, option) {
      let id = option.id;
      let callback = option.callback;
      let res = await api.getGroupInfo(id);
      let newGroupInfo = res.data;
      commit("group_saveInfo", newGroupInfo);
      !!callback && callback();
    },

    // 修改小组资料, 基本完成
    async saveGroupInfo({
      commit,
      state
    }, option) {
      let groupInfo = option.groupInfo;
      let callback = option.callback;

      commit("group_saveInfo", groupInfo);
      await api.saveGroupInfo(state.groupInfo);

      !!callback && callback();
    },

    // 邀请好友, 基本完成
    async inviteFriends({
      commit,
      state
    }, option) {
      let groupId = state.groupInfo._id,
        userId = option.userId,
        callback = option.callback;

      await api.inviteFriends(groupId, userId);
      !!callback && callback();
    },

    // 设置小组
    async groupSetting({
      commit,
      state
    }) {
      let res = await api.groupSetting();
    },

    // 上传图片
    async uploadImage({
      commit,
      state
    }, option) {
      let file = option.file;
      let callback = option.callback;
      let res = await api.uploadImage(file);
      let url = res.data.url;
      !!callback && callback(url);
    }
};

export default {
  state,
  mutations,
  actions,
  getters
};