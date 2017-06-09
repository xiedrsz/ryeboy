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
    store.commit("page_setPopup", this);
  }

  prompt(content, ok, cancel) {
    store.commit("page_showDialog", {
      show: true,
      type: "prompt",
      content,
      event: {
        ok,
        cancel
      }
    });
    store.commit("page_setPopup", this);
  }

  close() {
    store.commit("page_showDialog", {
      show: false
    });
    store.commit("page_setPopup");
  }
}

module.exports = new dialog();