import Vue from "vue";
import VueRouter from "vue-router";
import app from "js/app";
import routes from "js/routes";
import store from "store";
import api from "api";

// 引入过滤器
import "./js/utils/filter"

require("lazysizes");

Vue.use(VueRouter);
Vue.use({
  install() {
    Vue.prototype.$app = app;
  }
});

const router = new VueRouter({
  mode: "hash",
  base: __dirname,
  routes
});

const commit = store.commit || store.dispatch;
function plugin(Vue){
  // 弹出提示
  let promp = (msg, callback, cancel) => {
    commit('page_popue', {
      msg: msg,
      callback: callback,
      cancel: cancel
    })
  }

  Vue.promp = promp
  Object.defineProperties(Vue.prototype, {    
    $promp: {
      get() {
        return promp
      }
    }
  })
}
Vue.use(plugin);

if (localStorage.authenticated) {
  store.commit("user_assignAuth", JSON.parse(localStorage.user));
  // store.dispatch("initSubscribedChannels");
  store.dispatch("lesson_loadSettings");
} else {
  store.commit("diary_setDefaultChannels");
}

app.init().then(() => {
  app.show(new Vue(Vue.util.extend({
    router,
    store
  }, require("components/app.vue"))).$mount("#app"));
}).catch(() => {
  app.showStarupError();
});
