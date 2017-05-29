import Vue from "vue";
import VueRouter from "vue-router";
import routes from "js/routes.js";
import store from "store";
import api from "api";

require("lazysizes");

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: __dirname,
  routes
});

if (localStorage.authenticated) {
  store.commit("user_assignAuth", JSON.parse(localStorage.user));
  store.dispatch("initSubscribedChannels");
  store.dispatch("lesson_loadSettings");
} else {
  store.commit("diary_setDefaultChannels");
}

new Vue(Vue.util.extend({
  router,
  store
}, require("components/app.vue"))).$mount("#app");
