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
  }
};

export default {
  state,
  mutations
};