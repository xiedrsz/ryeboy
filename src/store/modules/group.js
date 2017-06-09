import Vue from "vue";
import api from "api";
import _ from "lodash";

// 默认小组列表分类
let defaultGroupChannels = [
  {
    id: "essence",
    name: "精品"
  },
  {
    id: "changed",
    name: "蜕变史"
  },
  {
    id: "latest",
    name: "最新"
  },
  {
    id: "welcome",
    name: "最热"
  },
  {
    id: "unwelcome",
    name: "最冷"
  },
  {
    id: "problems",
    name: "提问"
  }
]

let defaultGroupClass = [
  {
    id: "all",
    name: "全部"
  },
  {
    id: "latest",
    name: "最新"
  },
  {
    id: "welcome",
    name: "最热"
  },
  {
    id: "level",
    name: "等级"
  },
  {
    id: "honor",
    name: "荣誉"
  }, {
    id: "littleBoy",
    name: "16-23"
  }, {
    id: "BigBoy",
    name: "24-30"
  }
]

const state = {
  // 小组列表
  groups: [],

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

  // 花生小组信息，用于修改或查看小组信息
  groupInfo: {
    avatar: "",
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
        result[label] = _.filter(state.groupDiaries, {
          channel: label
        });
      });

      return result
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

      // 暂时屏蔽分类
      /*_.forEach(groupClass, (item) => {
        label = item.id;
        result[label] = _.filter(state.groups, (tmp) => {
          return tmp.classify.indexOf(label) > -1
        });
      });*/

      result.all = groups;

      return result
    }
};

const mutations = {
  /**
   * @Description 新增小组列表
   * @Param list Array 新小组列表
   */
  group_pushGroup(state, list) {
      state.groups.push.apply(state.groups, list);
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
      let _id = obj._id,
        tmp = _.filter(state.members, {
          _id
        });

      _.assign(tmp[0], obj);
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
      let _id = obj._id,
        tmp = _.filter(state.applys, {
          _id
        });

      _.assign(tmp[0], obj);
    },

    /**
     * @Description 新增小组消息（花生小组）列表
     * @Param list Array 新小组成员列表
     */
    group_pushDiaries(state, list) {
      state.groupDiaries.push.apply(state.groupDiaries, list);
    },

    /**
     * @Description 修改小组日记
     * @Param obj Object 新日记信息 eg: { _id: xx, ... }
     */
    group_saveDiaries(state, obj) {
      let _id = obj._id,
        tmp = _.filter(state.groupDiaries, {
          _id
        });

      _.assign(tmp[0], obj);
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
      let id = obj.id,
        tmp = _.filter(state.groups, {
          _id: id
        });
      !!tmp[0] && _.assign(tmp[0], obj);
    }
};

const actions = {
  // 获取小组列表, 基本完成
  async getGroups({
      commit
    }, name) {
      let res = await api.getGroups(name),
        groups = res.data,
        defInfo = {
          note: "加入",

          // 补，后期要删除
          memNum: 1,
          memMax: 50,
          levelMax: 5,
          medalMax: 30
        };

      _.forEach(groups, (item) => {
        _.assign(item, defInfo);
      });

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
      commit
    }, option) {
      let groupId = option.groupId,
        res = await api.getMembers(groupId);

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
        _id: userId,
        statusMsg: "已清退"
      });
    },

    // 获取申请列表, 基本完成
    async getApplys({
      commit
    }, option) {
      let groupId = option.groupId,
        res = await api.getApplys(groupId);
      
      console.log(res)

      commit("group_pushApplys", res.data);
    },

    // 同意申请, 基本完成
    async agreeApply({
      commit
    }, option) {
      let groupId = option.groupId,
        uesrId = option.uesrId,
        callback = option.callback;

      let res = await api.agreeApply(groupId, uesrId);
      commit("group_saveApplys", {
        _id: uesrId,
        statusMsg: "已通过"
      });
    },

    // 拒绝申请, 基本完成
    async rejectApply({
      commit
    }, option) {
      let groupId = option.groupId,
        uesrId = option.uesrId;
      let res = await api.rejectApply(groupId, uesrId);

      commit("group_saveApplys", {
        _id: uesrId,
        statusMsg: "已拒绝"
      });
    },

    // 获取小组消息, 基本完成
    async getGroupDiaries({
      commit
    }, id) {
      let res = await api.getGroupDiaries(id);

      commit("group_pushDiaries", res.data);
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
    }, id) {
      let res = await api.getGroupInfo(id);
      commit("group_saveInfo", res.data);
    },

    // 修改小组资料, 基本完成
    async saveGroupInfo({
      commit,
      state
    }, option) {
      let groupInfo = option.groupInfo,
        callback = option.callback,
        res;
      commit("group_saveInfo", groupInfo);
      res = await api.saveGroupInfo(groupInfo);
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
    }
};

export default {
  state,
  mutations,
  actions,
  getters
};