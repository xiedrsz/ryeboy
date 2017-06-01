import store from "store";

class actionSheet {
  show(actions) {
    store.commit("page_showActionSheet", {
      show: true,
      actions
    });
  }

  hide() {
    store.commit("page_showActionSheet", {
      show: false
    });
  }
}

module.exports = new actionSheet();