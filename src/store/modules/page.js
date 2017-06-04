const state = {
  title: "",
  actions: [],
  icons: [],
  loading: false,
  dialog: {
    show: false,
    type: "alert",
    title: "",
    content: ""
  },
  popue: {
    show: false,
    msg: "",
    callback: null,
    cancel: false
  }
};

const mutations = {
  page_setTitle(state, title) {
    state.title = title;
  },
  page_setActions(state, actions) {
    state.actions = JSON.parse(actions);
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
  }
};

export default {
  state,
  mutations
};