import store from "store";

class toolbars {
  create(toolbars) {
    store.commit("page_setToolbars", toolbars);
  }

  clear() {
    store.commit("page_setToolbars", []);
  }
}

module.exports = new toolbars();