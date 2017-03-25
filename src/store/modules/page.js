const state = {
  title: "",
  loading: false
};

const mutations = {
  setTitle(state, title) {
    state.title = title;
  },
  loading(state, show) {
    state.loading = show;
  }
};

export default {
  state,
  mutations
};