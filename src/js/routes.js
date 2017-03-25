export default [{
  path: "/home", component: require("components/pages/home/layout.vue"),
  children: [
    { path: "diary", component: require("components/pages/home/diary.vue"), meta: { keepAlive: true }},
    { path: "discipline", component: require("components/pages/home/discipline.vue"), meta: { keepAlive: true }},
    { path: "dynamic", component: require("components/pages/home/dynamic.vue"), meta: { keepAlive: true }},
    { path: "personal", component: require("components/pages/home/personal.vue"), meta: { keepAlive: true }}
  ]
}, {
  path: "/pages", component: require("components/pages/layout.vue"),
  children: [
    { path: "login", component: require("components/pages/login.vue"),
      beforeEnter: (to, from, next) => {
        to.query.redirect = from.path;
        next();
      }
    }
  ]
}, { path: "*", redirect: "/home/diary" }];