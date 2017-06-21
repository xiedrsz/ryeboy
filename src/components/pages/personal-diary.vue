<template>
  <div class="page"
       title="我的日记">
    <div class="tabs">
      <div v-for="(tab, index) in tabs"
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
            text: "每天日记",
            active: true
          },
          {
            text: "每周日记",
            active: false
          },
          {
            text: "精品日记",
            active: false
          }
        ],
        tabIndex: 0,
        viewType: "daily",
      };
    },
    methods: {
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
    computed: {
      userid() {
        return this.$store.state.user._id;
      }
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
  .tabs {
    height: 36px;
    min-height: 36px;
    @include flex-row;
    @include flex-vertical-center;
    border-bottom: 1px solid $color-divider;
    background-color: $color-hint-block;
  }

  .tab-link {
    margin-left: 16px;
  }

  .tab-link.active {
    color: $color-blue;
  }

  .content-wrap {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
</style>