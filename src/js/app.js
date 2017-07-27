import Vue from "vue";
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
import _ from "lodash";

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
    history.go(-1);
  }

  // 登录之后的一些处理
  async afterLogin(data) {
    localStorage.authenticated = true;
    localStorage.jwt = data.token;

    this.api.setAuthorization();
    this.userid = data.user._id;

    store.commit("user_setAuth", data.user);
    store.commit("diary_setChannelChanged");
    await store.dispatch("diary_getSubscribedChannels");
  }

  //注销之后的一些处理
  afterLogout() {
    this.api.logout();
    localStorage.removeItem("authenticated");
    localStorage.removeItem("user");
    store.commit("user_deleteAuth");
    store.commit("diary_setChannelChanged");
  }

  async getUser(userid) {
    let users = [{
      userid
    }];
    await store.dispatch("diary_ensureUsers", users);
    await store.dispatch("diary_updateUserInfo", users);
    return users[0];
  }

  adjustScrollableElement(selector, containerList) {
    let height = document.querySelector("main").clientHeight;
    if (containerList) {
      containerList.forEach(item => {
        height -= document.querySelector(item).offsetHeight;
      });
    }
    document.querySelector(selector).style.height = height + "px";
  }

  savePosition(el, id) {
    let attributeName = "data-scroll-position";
    if (id) {
      attributeName += "-" + id;
    }
    el.querySelectorAll(".keep-scroll-position").forEach(item => {
      item.setAttribute(attributeName, item.scrollLeft + "," + item.scrollTop);
    });
  }

  restorePosition(el, id) {
    let attributeName = "data-scroll-position";
    if (id) {
      attributeName += "-" + id;
    }
    if (el.hasAttribute(attributeName)) {
      let data = el.getAttribute(attributeName);
      if (data) {
        let position = data.split(",");
        el.scrollLeft = position[0];
        el.scrollTop = position[1];
      }
    }
    el.querySelectorAll(".keep-scroll-position").forEach(item => {
      let data = item.getAttribute(attributeName);
      if (data) {
        let position = data.split(",");
        item.scrollLeft = position[0];
        item.scrollTop = position[1];
      }
    });
  }

  selectPicture() {
    return new Promise((resolve, reject) => {
      navigator.camera.getPicture(imageUri => {
        resolve(imageUri);
      }, error => {
        reject("Unable to obtain picture: " + error, "app");
      }, {
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        mediaType: Camera.MediaType.PICTURE,
        targetWidth: 512,
        targetHeight: 512,
        quality: 75,
      });
    });
  }

  uploadPicture(filePath, filename, type) {
    if (!this.fileTransfer) {
      this.fileTransfer = new FileTransfer();
    }

    return new Promise((resolve, reject) => {
      let params = {
        filename: `${filename}.jpg`,
        type
      };

      this.fileTransfer.upload(filePath, encodeURI(`${this.config.apiAddress}/diary/uploadPictures`), res => {
        resolve(res);
      }, error => {
        reject(error);
      }, {
        params
      }, true);
    });
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

  login(redirect) {
    this.vue.$store.state.page.loginRedirect = redirect;
    this.vue.$refs.login.open();
  }

  init() {
    axios.interceptors.request.use(config => {
      if (config.method == "post") {
        this.posting = true;
        this.dialog.showLoading();
      }
      return config;
    }, error => {
      return Promise.reject(error);
    });

    axios.interceptors.response.use(response => {
      if (this.posting) {
        this.dialog.hideLoading();
        this.posting = false;
      }
      return response;
    }, error => {
      if (this.posting) {
        this.dialog.hideLoading();
        this.posting = false;
      }
      return Promise.reject(error);
    });

    if (localStorage.authenticated) {
      api.setAuthorization();
      let user = JSON.parse(localStorage.user);
      this.userid = user._id;
      store.commit("user_assignAuth", user);
      store.dispatch("diary_initSubscribedChannels");
      store.dispatch("lesson_loadSettings");
    } else {
      store.commit("diary_setDefaultChannels");
    }

    Vue.component("loadable-content", require("ui/loadable-content.vue"));
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