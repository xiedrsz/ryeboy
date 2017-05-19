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
  concern: [
    {
      _id: '56e4d40d731956005ce0156a',
      username: '学长土豆',
      portrait: '2',
      nickname: '学长土豆',
      grade: {
        lv: 41,
        exp: 51576
      }
    }
  ],
  // 关注 粉丝
  fans: [
    {
      _id: '56e4d40d731956005ce0156a',
      username: '粉丝一号',
      portrait: '2',
      nickname: '粉丝一号',
      grade: {
        lv: 41,
        exp: 51576
      }
    }
  ],
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
     * @Param item Object
     * eg: {
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
     * }
     */
    concern_addDynamic(state, item) {
      state.dynamic.unshift(item)
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
    }
};

export default {
  state,
  mutations,
  actions,
  getters
};