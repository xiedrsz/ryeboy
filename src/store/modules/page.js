import Vue from "vue";
import _ from "lodash";

const state = {
  title: "",
  actions: [],
  icons: [],
  toolbars: [],
  loading: false,
  popup: null, // 页面弹出内容，可能是对话框、操作列表、日期选择器等
  dialog: {
    show: false,
    type: "alert",
    title: "",
    content: "",
    isHtmlContent: false,
    okCallback: null,
    cancelCallback: null,
  },
  popue: {
    show: false,
    msg: "",
    callback: null,
    cancel: false
  },
  actionSheet: {
    show: false,
    actions: []
  },
  spacer: "",
  loginRedirect: "/"
};

const mutations = {
  page_setTitle(state, title) {
    state.title = title;
  },
  page_setToolbars(state, toolbars) {
    Vue.set(state, "toolbars", toolbars);
  },
  page_setIcons(state, icons) {
    state.icons = JSON.parse(icons);
  },
  page_showLoading(state, show) {
    state.loading = show;
  },
  page_showDialog(state, data) {
    Object.assign(state.dialog, data);
  },
  page_popue(state, prompt) {
    state.popue = {
      show: prompt.show == undefined ? true : prompt.show,
      msg: prompt.msg,
      callback: prompt.callback == undefined ? null : prompt.callback,
      cancel: !!prompt.cancel
    }
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
  page_setSpacer(state, spacer) {
    if (spacer) {
      state.spacer = spacer;
    } else {
      state.spacer = "";
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