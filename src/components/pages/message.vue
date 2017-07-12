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
      <component :is="viewType">
      </component>
    </keep-alive>
  </div>
</template>

<script>
  const viewTypes = {
    0: "comment",
    1: "like",
    2: "notice"
  };

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
        viewType: "comment"
      };
    },
    methods: {
      switchView(index) {
        this.tabs[this.tabIndex].active = false;
        this.tabs[index].active = true;
        this.tabIndex = index;
        this.viewType = viewTypes[index];
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
  @import "~scss/tabs.scss";
</style>