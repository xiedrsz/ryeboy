import store from "store";

class actionSheet {
  show(actions) {
    store.commit("page_showActionSheet", {
      show: true,
      actions
    });
    store.commit("page_setPopup", this);
  }

  close() {
    store.commit("page_showActionSheet", {
      show: false,
      actions: []
    });
  }
}

module.exports = new actionSheet();