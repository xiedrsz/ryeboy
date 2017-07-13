class cordova {
  back() {
    let store = this.app.vue.$store;

    if (store.state.page.loading) {
      return;
    }

    if (this.keyboardVisible || this.keyboardWillHide) {
      this.keyboardVisible = false;
      this.keyboardWillHide = false;
      clearTimeout(this.keyboardWillHideTimeout);
      return;
    }

    if (store.getters.page_popup) {
      store.getters.page_popup.close();
      return;
    }

    let route = this.app.vue.$router.currentRoute;
    if (route.matched[0].path == "/home") {
      this.app.dialog.prompt("你确定退出吗？", () => {
        navigator.app.exitApp();
      });
      return;
    }

    this.app.back();
  }

  resume() {

  }

  pause() {

  }

  keyboardhide() {
    this.keyboardVisible = false;
    this.keyboardWillHide = true;
    this.keyboardWillHideTimeout = setTimeout(() => {
      this.keyboardWillHide = false;
    }, 200);
  }

  keyboardshow() {
    this.keyboardVisible = true;
  }

  constructor(app) {
    this.app = app;
    this.keyboardWillHide = false;
    this.keyboardVisible = false;

    app.deviceready = false;

    document.addEventListener("deviceready", () => {
      app.deviceready = true;
      document.addEventListener("backbutton", this.back.bind(this), false);
      document.addEventListener("resume", this.resume.bind(this), false);
      document.addEventListener("pause", this.pause.bind(this), false);
      window.addEventListener("native.keyboardhide", this.keyboardhide.bind(this));
      window.addEventListener("native.keyboardshow", this.keyboardshow.bind(this));
    }, false);
  }
}

module.exports = cordova;