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
Vue.use(require("js/plugins/keepScrollPosition.js"));

const router = new VueRouter({
  mode: "hash",
  base: __dirname,
  routes
});

app.init();
app.show(new Vue(Vue.util.extend({
  router,
  store
<<<<<<< HEAD
}, require("components/app.vue"))).$mount("#app"));
=======
}, require("components/app.vue"))).$mount("#app");
>>>>>>> 6bb9d82f0801f7d038b2fe6c39e80d10651c2e17
