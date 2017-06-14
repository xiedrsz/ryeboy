import Vue from "vue";
import VueRouter from "vue-router";
import routes from "js/routes";
import store from "store";
import app from "js/app";

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

app.init();
app.show(new Vue(Vue.util.extend({
  router,
  store
}, require("components/app.vue"))).$mount("#app"));