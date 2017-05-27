import Vue from "vue";
import api from "api";
// 暂不会用
// import _ from "lodash";

// 频道管理
const channels = [{
  name: "",
  list: []
}];

const state = {
  // 订阅列表
  subscribles: [],

  // 频道内容，结构可能还要复杂（比如分级）
  subChannels: [],

  // 频道管理, 暂时是固定的，尚未配置
  channels: []
};

const getters = {};

const mutations = {
  /**
   * @Description 新增订阅列表
   * @Param list Array 新订阅列表
   */
  subs_pushSubscrible(state, list) {
      state.subscribles.push.apply(state.subscribles, list);
    },

    /**
     * @Description 新增频道内容
     * @Param list Array 新内容列表
     * @Param type String ['up', 'down'] 滚动类型，向上/向下, 默认向上
     */
    subs_addSubChannels(state, list, type = 'up') {
      let options = {
          up: "push",
          down: "unshift"
        },
        func = options[type];

      state.subChannels[func].apply(state.subChannels, list);
    },

    /**
     * @Description 初始化频道管理, 暂留（未必用得上）
     * @Param list Array 新频道
     */
    subs_initChannels(state, list) {
      state.channels.push.apply(state.channels, list);
    }
};

const actions = {
  // 获取订阅列表
  async getSubscribles({
      commit
    }) {
      let res = await api.getSubscribles();
      commit("subs_pushSubscrible", res);
    },

    // 获取订阅频道内容
    async getSubChannels({
      commit
    }, type) {
      let res = await api.getSubChannels();
      commit("subs_addSubChannels", res, type);
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