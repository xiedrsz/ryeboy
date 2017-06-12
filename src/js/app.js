import store from "store";
import cordova from "js/cordova";
import dialog from "js/utils/dialog";
import toolbars from "js/utils/toolbars";

require("lazysizes");

class app {
  show(vue) {
    this.vue = vue;
  }

  init() {
    this.cordova = new cordova(this);
    this.dialog = dialog;
    this.toolbars = toolbars;

    if (localStorage.authenticated) {
      store.commit("user_assignAuth", JSON.parse(localStorage.user));
      store.dispatch("initSubscribedChannels");
      store.dispatch("lesson_loadSettings");
    } else {
      store.commit("diary_setDefaultChannels");
    }
  }
}

module.exports = new app();