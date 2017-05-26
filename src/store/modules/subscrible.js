import Vue from "vue";
import api from "api";
// 暂不会用
// import _ from "lodash";

const state = {};

const getters = {};

const mutations = {};

const actions = {
  // 获取订阅列表
  async getSubscribles({
      commit
    }) {
      let res = await api.getSubscribles();
    },

    // 获取订阅频道内容
    async getSubChannels({
      commit
    }) {
      let res = await api.getSubChannels();
    },

    // 退订
    async unsubscribe({
      commit
    }) {
      let res = await api.unsubscribe();
    },

    // 添加订阅频道
    async addSubscrible({
      commit
    }) {
      let res = await api.addSubscrible();
    },

    // 订阅
    async subscrible({
      commit
    }) {
      let res = await api.subscrible();
    }
};

export default {
  state,
  mutations,
  actions,
  getters
};