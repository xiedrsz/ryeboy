import Vue from "vue";
import api from "api";
import _ from "lodash";

// 蜕变史分类
let spallationType = [
  {
    id: "essence",
    name: "精品"
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

// 频道分类
let labelTyoe = [
  {
    id: "support",
    name: "推荐"
    },
  {
    id: "bodyState",
    name: "身体状态"
    },
  {
    id: "mentalState",
    name: "心理状态"
    },
  {
    id: "commonState",
    name: "常见状态"
    }
]

const state = {
  // 频道分类
  channels: labelTyoe,

  // 频道列表(未订阅的)
  labels: [],

  // 订阅列表
  subscribles: [{}],

  // 当前阅读的订阅频道
  reading: {},

  // 蜕变史分类
  spallationType: spallationType,

  // 频道内容(蜕变史)
  subChannels: [{}, {}]
};

const getters = {
  /**
   * @Description 获取频道
   * @Param label String 标签，比如: [推荐、...], 暂未分类
   */
  getLabels(state) {
      let result = {},
        label = "",
        labels = state.labels,
        channels = state.channels;

      // 暂时屏蔽分类
      /*_.forEach(channels, (item) => {
        label = item.id;
        result[label] = _.filter(labels, (tmp) => {
          return tmp.classify.indexOf(label) > -1
        });
      });*/

      result.support = labels;

      return result
    },

    /**
     * @Description 获取频道内容, 暂未分类
     */
    getSubChannels(state) {
      let result = {},
        subChannels = state.subChannels;

      result.essence = subChannels;

      return result
    },
};

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
    },

    /**
     * @Description 初始化未订阅的频道列表
     * @Param list Array 新频道列表
     */
    subs_initLabels(state, list) {
      state.labels = list;
    }
};

const actions = {
  // 获取订阅列表
  async getSubscribles({
      commit
    }) {
      let res = await api.getSubscribles();
      commit("subs_pushSubscrible", res.data);
    },

    // 获取订阅频道内容
    async getSubChannels({
      commit
    }, type) {
      let res = await api.getSubChannels();
      commit("subs_addSubChannels", res, type);
    },

    // 获取未订阅的频道列表
    async getLabels({
      commit
    }) {
      let res = await api.getLabels(),
        list = res.data;

      _.map(list, (item) => {
        item.note = "订阅";
        return;
      });

      commit("subs_initLabels", res.data);
    },

    // 退订
    async unsubscribe({
      commit
    }, option) {
      let id = option.id,
        res = await api.unsubscribe(id);
    },

    // 订阅, Todo(频道id尚未返回)
    async subscrible({
      commit
    }, option) {
      let id = option.id,
        res = await api.subscrible(id);
    }
};

export default {
  state,
  mutations,
  actions,
  getters
};