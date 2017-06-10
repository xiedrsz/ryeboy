import store from "store";

class actionSheet {
  show(actions, vm) {
    store.commit("page_showActionSheet", {
      show: true,
      vm,
      actions
    });
    store.commit("page_setPopup", this);
  }

  close() {
    store.commit("page_showActionSheet", {
      show: false
    });
  }
}

module.exports = new actionSheet();