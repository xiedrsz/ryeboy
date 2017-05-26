const home = [
  "diary", "lesson", "dynamic", "personal"
];

const pages = [
  "login", "settings", "channel-manage", "lesson-manage", "change-password", "lesson-detail", "lesson-diary", "lesson-publish", "diary-detail"
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
    item.children = [];
    home.forEach(childrenPath => {
      item.children.push({
        path: childrenPath,
        name: childrenPath,
        meta: {
          keepAlive: true
        },
        component: require(`components/pages/home/${childrenPath}.vue`)
      });
    });
  }

  if (item.path == "/pages") {
    item.children = [];
    pages.forEach(childrenPath => {
      item.children.push({
        path: childrenPath,
        name: childrenPath,
        component: require(`components/pages/${childrenPath}.vue`)
      });
    });
  }
});

export default routes;