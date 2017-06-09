const dialog = require("js/utils/dialog");
const actionSheet = require("js/utils/actionSheet");

var vue = null;
var keyboardWillHide = false;
var keyboardWillHideTimeout;
var keyboardVisible = false;

class cordova {
  back() {
    if (keyboardVisible || keyboardWillHide) {
      keyboardVisible = false;
      keyboardWillHide = false;
      clearTimeout(keyboardWillHideTimeout);
      return;
    }

    let store = vue.$store;

    if (store.getters.page_popup) {
      store.getters.page_popup.close();
      return;
    }

    let route = vue.$router.currentRoute;
    if (route.matched[0].path == "/home") {
      dialog.prompt("你确定退出吗？", "exit");
      return;
    }

    history.go(-1);
  }

  resume() {

  }

  pause() {

  }

  keyboardhide() {
    keyboardVisible = false;
    keyboardWillHide = true;
    keyboardWillHideTimeout = setTimeout(() => {
      keyboardWillHide = false;
    }, 200);
  }

  keyboardshow() {
    keyboardVisible = true;
  }

  constructor(__vue) {
    vue = __vue;
    document.addEventListener("deviceready", () => {
      document.addEventListener("backbutton", this.back, false);
      document.addEventListener("resume", this.resume, false);
      document.addEventListener("pause", this.pause, false);
      window.addEventListener("native.keyboardhide", this.keyboardhide);
      window.addEventListener("native.keyboardshow", this.keyboardshow);
    }, false);
  }
}

module.exports = cordova;