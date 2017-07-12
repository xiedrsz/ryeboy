import Vue from "vue";
import _ from "lodash";

const state = {
  title: "",
  toolbars: [],
  loading: false,
  popup: null, // 页面弹出内容，可能是对话框、操作列表、日期选择器等
  dialog: {
    show: false,
    type: "alert",
    title: "",
    content: "",
    okCallback: null,
    cancelCallback: null,
  },
  actionSheet: {
    show: false,
    actions: []
  }
};

const mutations = {
  page_setTitle(state, title) {
    state.title = title;
  },
  page_setToolbars(state, toolbars) {
    Vue.set(state, "toolbars", toolbars);
  },
  page_showLoading(state, show) {
    state.loading = show;
  },
  page_showDialog(state, data) {
    Object.assign(state.dialog, data);
    if (state.dialog.show == false) {
      state.popup = null;
    }
  },
  page_showActionSheet(state, data) {
    Object.assign(state.actionSheet, data);
    if (state.dialog.show == false) {
      state.popup = null;
    }
  },
  page_setPopup(state, popup) {
    if (popup) {
      state.popup = popup;
    } else {
      state.popup = null;
    }
  }
};

const getters = {
  page_popup(state) {
    return state.popup;
  }
};

export default {
  state,
  mutations,
  getters
};