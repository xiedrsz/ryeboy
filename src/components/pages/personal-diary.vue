<template>
  <div class="page"
       title="我的日记">
    <div class="tabs">
      <div v-for="(tab, index) in tabs"
           :key="tab.id"
           class="tab-link"
           @click="readySwitchView(index)"
           :class="{ active: tab.active }">
        {{ tab.text }}
      </div>
    </div>
    <keep-alive>
      <component :is="context.viewType">
      </component>
    </keep-alive>
  </div>
</template>

<script>
  const viewTypes = {
    0: "daily",
    1: "weekly",
    2: "recommend"
  };

  export default {
    data() {
      return {
        tabs: [
          {
            id: 0,
            text: "每天日记",
            active: true
          },
          {
            id: 1,
            text: "每周日记",
            active: false
          },
          {
            id: 2,
            text: "精品日记",
            active: false
          }
        ],
        tabIndex: 0,
        context: {
          viewType: "daily"
        }
      };
    },
    methods: {
      adjustHeight() {
        this.$app.adjustScrollableElement(".content-wrap", [".tabs"]);
      },
      readySwitchView(index) {
        if (this.tabIndex == index) {
          return;
        }
        this.$app.savePosition(this.$el);
        this.switchView(index);
      },
      switchView(index) {
        this.tabs[this.tabIndex].active = false;
        this.tabs[index].active = true;
        this.tabIndex = index;

        this.context.index = index;
        this.context.viewType = viewTypes[index];

        this.$nextTick(() => {
          this.adjustHeight();
        });
      }
    },
    async activated() {
      this.context = await this.$store.dispatch("diary_getUserData", {
        userid: this.$app.userid
      });
      this.switchView(this.context.index);
    },
    components: {
      "daily": require("components/pages/personal-diary/personal-diary-daily.vue"),
      "weekly": require("components/pages/personal-diary/personal-diary-weekly.vue"),
      "recommend": require("components/pages/personal-diary/personal-diary-recommend.vue"),
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  @import "~scss/tabs.scss";
</style>