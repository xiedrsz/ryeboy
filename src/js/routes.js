import store from "store";

const home = [
  "diary", "lesson", "dynamic", "personal"
];

const pages = [
  "login", "settings", "channel-manage", "lesson-manage", "change-password",
  "lesson-detail", "lesson-diary", "lesson-publish", "diary-detail",
  "personal-diary", "personal-diary-weekly-list", "message"
];

const routes = [{
  path: "/home",
  component: require("components/pages/home/layout.vue"),
}, {
  path: "/pages",
  component: require("components/pages/layout.vue"),
}, {
  path: "*",
  redirect: "/home/diary"
}];

routes.forEach(item => {
  if (item.path == "*") {
    return;
  }

  if (item.path == "/home") {
    item.component.name = "home";
    item.children = [];
    home.forEach(childrenPath => {
      let component = require(`components/pages/home/${childrenPath}.vue`);
      component.name = childrenPath;
      item.children.push({
        path: childrenPath,
        name: childrenPath,
        component
      });
    });
  }

  if (item.path == "/pages") {
    item.component.name = "pages";
    item.children = [];
    pages.forEach(childrenPath => {
      let component = require(`components/pages/${childrenPath}.vue`);
      component.name = childrenPath;
      item.children.push({
        path: childrenPath,
        name: childrenPath,
        component,
        beforeEnter: (to, from, next) => {
          store.commit("page_addCache", to);
          next();
        }
      });
    });
  }
});

export default routes;