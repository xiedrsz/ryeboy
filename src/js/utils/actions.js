import store from "store";

class actions {
  show(actions) {
    store.commit("page_setActions", actions);
  }
}

module.exports = new actions();