const state = {
  title: "",
  actions: [],
  loading: false,
  popup: null, // 页面弹出内容，可能是对话框、操作列表、日期选择器等
  dialog: {
    show: false,
    type: "alert",
    title: "",
    content: "",
    event: {
      ok: "",
      cancel: ""
    }
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
  page_setActions(state, actions) {
    state.actions = JSON.parse(actions);
  },
  page_showLoading(state, show) {
    state.loading = show;
  },
  page_showDialog(state, data) {
    Object.assign(state.dialog, data);
  },
  page_showActionSheet(state, data) {
    Object.assign(state.actionSheet, data);
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