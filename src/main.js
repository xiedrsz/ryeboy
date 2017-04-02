import Vue from "vue";
import VueRouter from "vue-router";
import routes from "js/routes.js";
import store from "store";
import * as types from "store/mutation-types";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: __dirname,
  routes
});

if (localStorage.authenticated) {
  store.commit(types.SET_USER_AUTH, {
    id: localStorage.userid,
    username: localStorage.username,
    sessionToken: localStorage.sessionToken
  });
}

new Vue(Vue.util.extend({
  router,
  store
}, require("components/app.vue"))).$mount("#app");