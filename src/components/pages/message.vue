<template>
  <div class="page"
       title="消息">
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
            text: "评论",
            active: true
          },
          {
            id: 1,
            text: "点赞",
            active: false
          },
          {
            id: 2,
            text: "通知",
            active: false
          }
        ],
        tabIndex: 0,
        viewType: "comment",
      };
    },
    methods: {
      switchView(index) {
        this.tabs[this.tabIndex].active = false;
        this.tabs[index].active = true;
        this.tabIndex = index;

        switch (index) {
          case 1:
            this.viewType = "like";
            break;

          case 2:
            this.viewType = "notice";
            break;

          default:
            this.viewType = "comment";
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
      "comment": require("components/pages/message/message-comment.vue"),
      "like": require("components/pages/message/message-like.vue"),
      "notice": require("components/pages/message/message-notice.vue"),
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
    margin-left: 24px;
  }

  .tab-link.active {
    color: $color-blue;
  }
</style>