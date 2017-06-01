const state = {
  title: "",
  actions: [],
  loading: false,
  dialog: {
    show: false,
    type: "alert",
    title: "",
    content: ""
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
  }
};

export default {
  state,
  mutations
};