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
      content,
      isHtmlContent: false,
    });
    store.commit("page_setPopup", this);
  }

  prompt(content, okCallback, cancelCallback) {
    store.commit("page_showDialog", {
      show: true,
      type: "prompt",
      content,
      isHtmlContent: false,
      okCallback,
      cancelCallback
    });
    store.commit("page_setPopup", this);
  }

  promptHtml(content, okCallback, cancelCallback) {
    store.commit("page_showDialog", {
      show: true,
      type: "prompt",
      content,
      isHtmlContent: true,
      okCallback,
      cancelCallback
    });
    store.commit("page_setPopup", this);
  }

  close() {
    store.commit("page_showDialog", {
      show: false,
      secondary: "",
      okCallback: null,
      cancelCallback: null,
    });
  }
}

module.exports = new dialog();