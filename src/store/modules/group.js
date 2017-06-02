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
  groupInfoTmp: {},

  // 小组成员列表
  members: [],

  // 组群申请列表
  applys: [],

  // 小组消息（花生小组）列表
  groupNews: [],

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
  getGroupNews(state) {
      let result = {},
        label = "",
        channels = state.channels,
        groupNews = state.groupNews;

      _.forEach(channels, (item) => {
        label = item.id;
        result[label] = _.filter(state.groupNews, {
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

      _.forEach(groupClass, (item) => {
        label = item.id;
        result[label] = _.filter(state.groups, (tmp) => {
          return tmp.classify.indexOf(label) > -1
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
     * @Description 暂存小组资料
     * @Param obj Object 新小组资料
     */
    group_saveInfo(state, obj) {
      _.assign(state.groupInfo, obj);
    },

    /**
     * @Description 修改小组列表
     * @Param obj Object 新小组资料 eg:{ id: xx, ... }
     */
    group_saveGroups(state, obj) {
      let id = obj.id,
        tmp = _.filter(state.groups, {
          id: id
        });
      console.log(tmp);
      !!tmp[0] && _.assign(tmp[0], obj);
    }

};

const actions = {

  // 获取小组列表
  async getGroups({
      commit
    }, name) {
      let res = await api.getGroups(name);
      console.log(res);
      commit("group_pushGroup", res.data);
    },

    // 加入小组
    async addGroup({
      commit
    }, option) {
      let id = option.id,
        userid = option.userid,
        res = await api.addGroup(id, userid);

      commit("group_saveGroups", {
        id: id,
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
    }, id) {
      let res = await api.getGroupNews(id);
      commit("group_pushGroupNews", res.data);
    },

    // 获取小组资料
    async getGroupInfo({
      commit
    }, id) {
      let res = await api.getGroupInfo(id);
      commit("group_saveInfo", res.data);
    },

    // 修改小组资料
    async saveGroupInfo({
      commit,
      state
    }, option) {
      let groupInfo = option.groupInfo,
        callback = option.callback,
        res;
      commit("group_saveInfo", groupInfo);
      res = await api.saveGroupInfo(state.groupInfo);
      !!callback && callback();
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