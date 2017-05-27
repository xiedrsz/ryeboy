import Vue from "vue";
import api from "api";
// 暂不会用
// import _ from "lodash";

const state = {
  // 麦田信息
  ryeInfo: {},

  // 问卷信息
  questionnaire: [],

  // 回答
  answer: []
};

const getters = {};

const mutations = {
  /**
   * @Description 初始化麦田信息
   * @Param obj Object 新麦田信息
   */
  rye_initryeInfo(state, obj) {
      _.assign(state.ryeInfo, obj);
    },

    /**
     * @Description 初始化问卷信息
     * @Param list Array 问卷信息
     */
    group_initQuestionnaire(state, list) {
      state.questionnaire = list;
    },

    /**
     * @Description 初始化答案
     * @Param list Array 答案
     */
    group_initAnswer(state, list) {
      state.answer = list;
    }
};

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