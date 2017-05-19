const home = [
  "diary", "lesson", "dynamic", "personal"
];

const pages = [
  "login", "settings", "channel-manage", "lesson-manage", "change-password", "lesson-detail", "lesson-diary"
];

const routes = [{
  path: "/home",
  component: require("components/pages/home/layout.vue"),
}, {
  path: "/pages",
  component: require("components/pages/layout.vue"),
}, {
  path: "/dynamic",
  component: require("components/pages/layout.vue"),
  children: [
    {
      path: "subscrible",
      component: require("components/pages/dynamic/subscrible.vue"),
      name: "subscrible",
      meta: {
        keepAlive: true
      }
    }, {
      path: "concern",
      component: require("components/pages/dynamic/concern.vue"),
      name: "concern",
      meta: {
        keepAlive: true
      },
      children: [{
        path: "dynamic",
        component: require("components/pages/dynamic/concern/dynamic.vue"),
        name: "concern-dynamic",
        meta: {
          keepAlive: true
        }
      }, {
        path: "concern",
        component: require("components/pages/dynamic/concern/concern.vue"),
        name: "concern-concern",
        meta: {
          keepAlive: true
        }
      }, {
        path: "fans",
        component: require("components/pages/dynamic/concern/fans.vue"),
        name: "concern-fans",
        meta: {
          keepAlive: true
        }
      }]
    }, {
      path: "concernadd",
      component: require("components/pages/dynamic/concern-add.vue"),
      name: "concern-add",
      meta: {
        keepAlive: true
      }
    }]
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