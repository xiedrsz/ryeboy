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
    concern_addDynamic(state, list) {
      state.dynamic.unshift.apply(state.dynamic, list);
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
     * @Function 清除暂留关注人
     */
    concern_filterConcern(state, list) {
      state.concern = _.filter(state.concern, (item) => {
        return item.note === "取消";
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

      tmp[0].likeCount++;
      tmp[0].likeIt = true;
    },
    /**
     * @function 评论
     * @Param id String 日记id
     */
    concern_comment(state, id) {
      let tmp = _.filter(state.dynamic, {
        id
      });
      tmp[0].commentCount++;
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
    }) {
      commit("save_loading", {
        no: false,
        err: false,
        none: false,
        icon: true
      });

      let list = [];

      await api.getDynamicDiaries().then((res) => {
        !!res && (list = res.data);
      }).catch(() => {
        commit("save_loading", {
          err: true
        });
      });

      commit("concern_addDynamic", list);

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

      _.map(list, (item) => {
        item.note = "取消";
        return item;
      });

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
      commit
    }) {
      let res = await api.getNewConcern(),
        list = res.data;

      _.map(list, (item) => {
        item.note = "关注";
        return item;
      });

      commit("concern_initNewConcern", list);
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