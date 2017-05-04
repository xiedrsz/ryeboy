import Vue from "vue";
import VueRouter from "vue-router";
import routes from "js/routes.js";
import store from "store";

require("lazysizes");

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: __dirname,
  routes
});

if (localStorage.authenticated) {
  store.commit("user_setAuth", {
    id: localStorage.userid,
    username: localStorage.username,
    sessionToken: localStorage.sessionToken
  });
  store.dispatch("initSubscribedChannels");
} else {
  store.commit("diary_setDefaultChannels");
}

new Vue(Vue.util.extend({
  router,
  store
}, require("components/app.vue"))).$mount("#app");