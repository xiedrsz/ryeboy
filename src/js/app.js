import axios from "axios";
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

  // 登录之后的一些处理
  async afterLogin(data) {
    localStorage.authenticated = true;
    localStorage.jwt = data.token;

    this.api.setAuthorization();

    store.commit("user_setAuth", data.user);
    store.commit("diary_setChannelChanged");
    await store.dispatch("getSubscribedChannels");
  }

  //注销之后的一些处理
  afterLogout() {
    this.api.logout();
    localStorage.removeItem("authenticated");
    localStorage.removeItem("user");
    store.commit("user_deleteAuth");
    store.commit("diary_setChannelChanged");
  }

  adjustScrollableElement(selector, containerList) {
    let height = document.querySelector("main").clientHeight;
    if (containerList) {
      containerList.forEach(item => {
        height -= document.querySelector(item).clientHeight;
      });
    }
    document.querySelector(selector).style.height = height + "px";
  }

  show(vue) {
    this.vue = vue;
    this.user = vue.$store.state.user;
  }

  toast(text) {
    this.vue.$refs.toast.$el.MaterialSnackbar.showSnackbar({
      message: text
    });
  }

  init() {
    axios.interceptors.request.use(config => {
      if (config.method == "post") {
        this.dialog.showLoading();
      }
      return config;
    }, error => {
      return Promise.reject(error);
    });

    axios.interceptors.response.use(response => {
      this.dialog.hideLoading();
      return response;
    }, error => {
      this.dialog.hideLoading();
      return Promise.reject(error);
    });

    if (localStorage.authenticated) {
      api.setAuthorization();
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