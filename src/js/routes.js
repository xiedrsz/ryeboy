const home = [
  "diary", "lesson", "dynamic", "personal"
];

const pages = [
  "login", "settings", "channel-manage", "lesson-manage", "change-password", "lesson-detail", "lesson-diary"
];

const dynamic = [
  "subscrible",
  "concern-add",
  "group",
  "plan",
  "questionnaire",
  "subscrible/spallation",
  "subscrible/subscrible-manage",
  "group/group-apply",
  "group/group-card",
  "group/group-create",
  "group/group-find",
  "group/group-grade",
  "group/group-info",
  "group/group-intro",
  "group/group-invite",
  "group/group-medal",
  "group/group-member",
  "group/group-setting"
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
  children: [{
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

  // 动态
  if (item.path == "/dynamic") {
    let nameTmp;
    dynamic.forEach(childrenPath => {
      nameTmp = childrenPath.match(/\/?(\w+\-?\w+)$/g)[0].replace("/", "");
      item.children.push({
        path: nameTmp,
        name: nameTmp,
        component: require(`components/pages/dynamic/${childrenPath}.vue`),
        meta: {
          keepAlive: true
        }
      });
    });
  }
});

export default routes;