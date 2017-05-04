const state = {
  title: "",
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