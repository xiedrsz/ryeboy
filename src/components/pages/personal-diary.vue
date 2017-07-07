<template>
  <div class="page"
       title="我的日记">
    <div class="tabs">
      <div v-for="(tab, index) in tabs"
           :key="tab.id"
           class="tab-link"
           @click="switchView(index)"
           :class="{ active: tab.active }">
        {{ tab.text }}
      </div>
    </div>
    <keep-alive>
      <component :is="viewType"
                 v-keep-scroll-position>
      </component>
    </keep-alive>
  </div>
</template>

<script>
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
        viewType: "daily",
      };
    },
    watch: {
      viewType() {
        this.$nextTick(() => {
          this.adjustHeight();
        });
      }
    },
    methods: {
      adjustHeight() {
        this.$app.adjustScrollableElement(".content-wrap", [".tabs"]);
      },
      switchView(index) {
        this.tabs[this.tabIndex].active = false;
        this.tabs[index].active = true;
        this.tabIndex = index;

        switch (index) {
          case 1:
            this.viewType = "weekly";
            break;

          case 2:
            this.viewType = "recommend";
            break;

          default:
            this.viewType = "daily";
            break;
        }
      }
    },
    components: {
      "daily": require("components/pages/personal-diary/personal-diary-daily.vue"),
      "weekly": require("components/pages/personal-diary/personal-diary-weekly.vue"),
      "recommend": require("components/pages/personal-diary/personal-diary-recommend.vue"),
    },
    mounted() {
      this.adjustHeight();
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  @import "~scss/tabs.scss";
</style>