const home = [
  "diary", "lesson", "dynamic", "personal"
];

const pages = [
  "login", "register", "settings", "channel-manage", "lesson-manage", "change-password",
  "lesson-detail", "lesson-diary", "lesson-publish", "diary-detail",
  "personal-diary", "personal-diary-weekly-list", "message", "diary-like-list", "user-detail",
  "favorite", "status", "personal-info", "personal-info-edit", "feedback", "share", "search",
  "answer-list", "answer"
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

const mixin = {
  beforeRouteLeave(to, from, next) {
    this.$app.savePosition(this.$el, this.$route.query.id);
    next();
  },
  methods: {
    __restorePosition() {
      this.$nextTick(() => {
        this.$app.restorePosition(this.$el, this.$route.query.id);
      });
    }
  }
};

routes.forEach(item => {
  if (item.path == "*") {
    return;
  }

  if (item.path == "/home") {
    item.component.name = "home";
    item.children = [];
    home.forEach(childrenPath => {
      let component = require(`components/pages/home/${childrenPath}.vue`);
      component.mixins = [mixin];
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
      component.mixins = [mixin];
      component.name = childrenPath;
      item.children.push({
        path: childrenPath,
        name: childrenPath,
        component
      });
    });
  }
});

export default routes;