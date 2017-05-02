import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import page from "./modules/page";
import diary from "./modules/diary";
import lesson from "./modules/lesson";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    page,
    diary,
    lesson
  },
});