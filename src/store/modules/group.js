import Vue from "vue";
import api from "api";
// 暂不回用
// import _ from "lodash";

const state = {};

const getters = {};

const mutations = {};

const actions = {
  // 获取小组列表
  async getGroups({
      commit
    }) {
      let res = await api.getGroups();
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
    },

    // 创建小组
    async createGroup({
      commit
    }) {
      let res = await api.createGroup();
    },

    // 获取小组成员
    async getMembers({
      commit
    }) {
      let res = await api.getMembers();
    },

    // 获取申请列表
    async getApplys({
      commit
    }) {
      let res = await api.getApplys();
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
    },

    // 获取小组资料
    async getGroupInfo({
      commit
    }) {
      let res = await api.getGroupInfo();
    },

    // 修改小组资料
    async saveGroupInfo({
      commit
    }) {
      let res = await api.saveGroupInfo();
    },

    // 邀请好友
    async inviteFriends({
      commit
    }) {
      let res = await api.inviteFriends();
    },

    // 设置小组
    async groupSetting({
      commit
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