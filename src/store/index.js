import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import page from "./modules/page";
import diary from "./modules/diary";
import lesson from "./modules/lesson";
import concern from "./modules/concern";
import group from "./modules/group";
import subscrible from "./modules/subscrible";
import rye from "./modules/rye";
import search from "./modules/search";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    page,
    diary,
    lesson,
    concern,
    group,
    subscrible,
    rye,
    search
  },
});
