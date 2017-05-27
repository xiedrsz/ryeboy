import Vue from "vue";
import api from "api";
import _ from "lodash";

// window._ = _;

const state = {
  // 小组列表
  groups: [],

  // 查找小组结果页
  searchList: [],

  // 小组临时信息，用于创建组时暂存
  groupInfoTmp: {},

  // 小组成员列表
  members: [],

  // 组群申请列表
  applys: [],

  // 小组消息（花生小组）列表
  groupNews: [],

  // 花生小组信息，用于修改或查看小组信息
  groupInfo: {}
};

const getters = {
  /**
   * @Description 获取小组列表
   * @Param label String 标签，比如: [全部、最新、...]
   */
  getGroups(state, label) {
      return _.filter(state.groups, {
        label: label
      });
    },

    /**
     * @Description 获取小组消息（花生小组）列表
     * @Param label String 标签，比如: [精品、最新、...]
     */
    getGroupNews(state, label) {
      return _.filter(state.groupNews, {
        label: label
      });
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
    group_pushMember(state, list) {
      state.members.push.apply(state.members, list);
    },

    /**
     * @Description 新增组群申请列表
     * @Param list Array 新小组成员列表
     */
    group_pushApplys(state, list) {
      state.applys.push.apply(state.applys, list);
    },

    /**
     * @Description 新增小组消息（花生小组）列表
     * @Param list Array 新小组成员列表
     */
    group_pushGroupNews(state, list) {
      state.groupNews.push.apply(state.groupNews, list);
    },

    /**
     * @Description 新增小组消息（花生小组）列表
     * @Param list Array 新小组成员列表
     */
    group_pushGroupNews(state, list) {
      state.groupNews.push.apply(state.groupNews, list);
    },

    /**
     * @Description 暂存小组资料
     * @Param obj Object 新小组资料
     */
    group_saveInfo(state, obj) {
      _.assign(state.groupInfo, obj);
    }
};

const actions = {
  // 获取小组列表
  async getGroups({
      commit,
      state
    }) {
      let res = await api.getGroups();
      commit("group_pushGroup", res);
    },

    // 加入小组
    async addGroup({
      commit
    }) {
      let res = await api.addGroup();
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
    }) {
      let res = await api.createGroup(state.groupInfoTmp);
    },

    // 获取小组成员
    async getMembers({
      commit
    }) {
      let res = await api.getMembers();
      commit("group_pushMember", res);
    },

    // 获取申请列表
    async getApplys({
      commit
    }) {
      let res = await api.getApplys();
      commit("group_pushApplys", res);
    },

    // 同意申请
    async agreeApply({
      commit
    }) {
      let res = await api.agreeApply();
    },

    // 拒绝申请
    async rejectApply({
      commit
    }) {
      let res = await api.rejectApply();
    },

    // 获取小组消息
    async getGroupNews({
      commit
    }) {
      let res = await api.getGroupNews();
      commit("group_pushGroupNews", res);
    },

    // 获取小组资料
    async getGroupInfo({
      commit
    }) {
      let res = await api.getGroupInfo();
      commit("group_saveInfo", res);
    },

    // 修改小组资料
    async saveGroupInfo({
      commit,
      state
    }) {
      commit("group_saveInfo", res);
      let res = await api.saveGroupInfo(state.groupInfo);
    },

    // 邀请好友
    async inviteFriends({
      commit
    }) {
      let res = await api.inviteFriends();
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