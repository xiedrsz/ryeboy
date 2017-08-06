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
    jsonp(`${this.app.config.ossAddress}/config/app.json?callback=jsonpCallback&hash=${(new Date()).getTime()}`, (error, data) => {
      if (!error) {
        let key = "hot-update-build";
        let build = this.app.build;
        if (localStorage.getItem(key)) {
          build = Number(localStorage.getItem(key));
        }
        if (data.build != build) {
          localStorage.setItem(key, data.build);
          location.reload();
        }
      }
    });

    this.app.vue.$store.dispatch("user_getNewMessageCount");
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
    Object.assign(app, window.app);

    document.addEventListener("deviceready", () => {
      app.deviceready = true;
      app.platform = device.platform.toLowerCase();
      document.addEventListener("backbutton", this.back.bind(this), false);
      document.addEventListener("resume", this.resume.bind(this), false);
      document.addEventListener("pause", this.pause.bind(this), false);
      window.addEventListener("native.keyboardhide", this.keyboardhide.bind(this));
      window.addEventListener("native.keyboardshow", this.keyboardshow.bind(this));
    }, false);
  }
}

module.exports = cordova;