import Vue from "vue";
import api from "api";
// 暂不会用
// import _ from "lodash";

const state = {};

const getters = {};

const mutations = {};

const actions = {
  // 获取麦田计划
  async getPlan({
      commit
    }) {
      let res = await api.getPlan();
    },

    // 获取问卷信息
    async getQuestionnaire({
      commit
    }) {
      let res = await api.getQuestionnaire();
    },

    // 提交问卷
    async answerQuestionnaire({
      commit
    }) {
      let res = await api.answerQuestionnaire();
    }
};

export default {
  state,
  mutations,
  actions,
  getters
};