export default [{
  path: "/home", component: require("components/pages/home/layout.vue"),
  children: [
    { path: "diary", component: require("components/pages/home/diary.vue"), meta: { keepAlive: true }},
    { path: "discipline", component: require("components/pages/home/discipline.vue"), meta: { keepAlive: true }},
    { path: "message", component: require("components/pages/home/message.vue"), meta: { keepAlive: true }},
    { path: "personal", component: require("components/pages/home/personal.vue"), meta: { keepAlive: true }}
  ]
}, { path: "*", redirect: "/home/diary" }];