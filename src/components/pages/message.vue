<template>
  <div class="page"
       title="消息">
    <div class="tabs">
      <div v-for="(tab, index) in tabs"
           :key="tab.id"
           class="tab-link"
           @click="readySwitchView(index)"
           :data-badge="messageCount[tab.id]"
           :class="{ active: tab.active, badge: messageCount[tab.id] }">
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
    1: "notice"
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
            text: "通知",
            active: false
          }
        ],
        tabIndex: 0,
        viewType: "comment"
      };
    },
    computed: {
      messageCount() {
        let {
          messageCount
        } = this.$store.state.user;
        let r = [0, 0];
        if (!messageCount) {
          return r;
        }
        r[0] = messageCount.comment;
        r[1] = messageCount.system;
        for (var i = 0; i < r.length; i++) {
          if (r[i] > 99) {
            r[i] = "...";
          }
        }
        return r;
      }
    },
    methods: {
      clearMessageCount(index) {
        let {
          messageCount,
          fetchTime,
          _id
        } = this.$store.state.user;
        if (messageCount && fetchTime) {
          if (index == 0) {
            messageCount.comment = 0;
            fetchTime.notice.comment = new Date();
          } else if (index == 1) {
            messageCount.system = 0;
            fetchTime.notice.system = new Date();
          }

          let key = `${_id}_fetchTime`;
          this.$app.storage.setObject(key, fetchTime);
        }
      },
      readySwitchView(index) {
        this.clearMessageCount(index);
        if (this.tabIndex == index) {
          return;
        }
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.$app.savePosition(this.$el);
        this.switchView(index);
      },
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
    },
    activated() {
      this.timer = setTimeout(() => {
        this.clearMessageCount(this.tabIndex);
      }, 8000);
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  @import "~scss/tabs.scss";
  .tab-link {
    height: 100%;
    @include flex-row;
    @include flex-center;
    position: relative;
  }

  .badge[data-badge]:after {
    content: attr(data-badge);
    font-size: 12px;
    font-family: Arial, Helvetica, sans-serif;
    padding: 0 3px;
    color: #fff;
    height: 18px;
    background: $color-red;
    border-radius: 2px;
    position: absolute;
    right: -14px;
    top: 2px;
    min-width: 12px;
    text-align: center;
  }
</style>