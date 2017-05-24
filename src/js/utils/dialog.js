import store from "store";

class dialog {
  showLoading() {
    store.commit("page_showLoading", true);
  }

  hideLoading() {
    store.commit("page_showLoading", false);
  }

  text(content) {
    store.commit("page_showDialog", {
      show: true,
      type: "alert",
      content
    });
  }
}

module.exports = new dialog();