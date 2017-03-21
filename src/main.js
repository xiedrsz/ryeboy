import Vue from "vue";
import VueRouter from "vue-router";
import routes from "js/routes.js";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: __dirname,
  routes
});

new Vue({
  router,
  render: h => h(require("components/app.vue"))
}).$mount("#app");