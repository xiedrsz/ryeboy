import Vue from "vue";
import api from "api";
import _ from "lodash";

const datetime = require("js/utils/datetime.js");

const state = {
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
  dynamic: [
    /*{
      _id: '589b30c6a3335154090e1682',
      userid: '588056609a469177ac5302e7',
      date: '2017-02-08T00:00:00.000Z',
      text: '刚才尝试了一下完整的麦式一段，麦式运动了不得啊，做的时候感觉整个泌尿系统都在活动，睾丸处能感受到明显的血液流动的感觉，做完神清气爽，口齿生津，照镜子观察自己好像变帅了一点点，哈哈',
      privacy: 0,
      createdAt: '2017-02-08T14:52:54.378Z',
      updatedAt: '2017-02-09T16:21:07.063Z',
      userLv: 3,
      likeCount: 10,
      commentCount: 45,

      username: "张三",
      avatar: "/img/default-avatar.png",
      escapedText: '刚才尝试了一下完整的麦式一段，麦式运动了不得啊，做的时候感刚才尝试了一下完整的麦式一段，麦式运动了不得啊，做的时候感刚才尝试了一下完整的麦式一段，麦式运动了不得啊，做的时候感',
      time: datetime.formatDiaryCreated('2017-02-08T14:52:54.378Z')
    }*/
  ],
  // 关注 关注列表
  concern: [],
  // 关注 粉丝
  fans: [],
  // 新 关注人列表
  newconcern: []
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
      state.overview[1].name = "关注" + obj.cons;
      state.overview[2].name = "粉丝" + obj.fans;
    },
    /**
     * @Description 添加 动态
     * @Param item Object 动态详情
     */
    concern_addDynamic(state, item) {
      state.dynamic.unshift(item)
    },
    /**
     * @Function 添加关注人
     * @Param list Array 关注人列表
     */
    concern_addConcern(state, list) {
      state.concern = list;

      /*list.forEach((item) => {
        state.concern.push(item)
      });*/
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
     * @Param obj Object {index: 索引, val: 1/-1}
     */
    concern_like(state, obj) {
      state.dynamic[obj.index].likeCount = state.dynamic[obj.index].likeCount + obj.val
      state.dynamic[obj.index].likeIt = obj.val == 1 ? true : false
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

    async getDynamic({
      commit,
      rootState
    }) {
      let res = await api.getDynamicDiaries(),
        obj = res.data;
      commit("concern_addDynamic", obj);
    },

    // 点赞
    async getLike({
      commit,
      rootState
    }, item) {
      commit('concern_like', item);
    },

    // 获取关注人
    async getConcern({
      commit,
      rootState
    }) {
      let res = await api.getConcerns(),
        list = res.data;
      commit("concern_addConcern", list);
    },

    // 获取粉丝
    async getFans({
      commit,
      rootState
    }) {
      let res = await api.getFans(),
        list = res.data;
      commit("concern_addFans", list);
    },

    // 获取新关注人列表
    async getNewConcern({
      commit,
      rootState
    }) {
      let res = await api.getNewConcern(),
        list = res.data;
      commit("concern_initNewConcern", list);
    },

    // 取消关注
    async cancelConcern({
      commit,
      rootState
    }, option) {
      commit('concern_cancel', option);
    },

    // 添加关注
    async addConcern({
      commit,
      rootState
    }, option) {
      commit('concern_add', option);
    }
};

export default {
  state,
  mutations,
  actions,
  getters
};