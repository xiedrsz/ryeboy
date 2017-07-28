import Vue from "vue";
import VueRouter from "vue-router";
import app from "js/app";
import routes from "js/routes";
import store from "store";

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

app.init().then(() => {
  app.show(new Vue(Vue.util.extend({
    router,
    store
  }, require("components/app.vue"))).$mount("#app"));
});