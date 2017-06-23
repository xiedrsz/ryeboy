import store from "store";
import api from "api";
import config from "js/config";
import cordova from "js/cordova";
import dialog from "js/utils/dialog";
import toolbars from "js/utils/toolbars";
import textHelper from "js/utils/textHelper";
import collectionHelper from "js/utils/collectionHelper";
import datetime from "js/utils/datetime";
import actionSheet from "js/utils/actionSheet";

require("lazysizes");

class app {
  delay(timeout) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  }

  back() {
    store.commit("page_removeCache");
    history.go(-1);
  }

  show(vue) {
    this.vue = vue;
  }

  init() {
    if (localStorage.authenticated) {
      store.commit("user_assignAuth", JSON.parse(localStorage.user));
      store.dispatch("initSubscribedChannels");
      store.dispatch("lesson_loadSettings");
    } else {
      store.commit("diary_setDefaultChannels");
    }
  }

  constructor() {
    this.config = config;
    this.api = api;
    this.cordova = new cordova(this);
    this.dialog = dialog;
    this.toolbars = toolbars;
    this.textHelper = textHelper;
    this.collectionHelper = collectionHelper;
    this.datetime = datetime;
    this.actionSheet = actionSheet;
  }
}

module.exports = new app();