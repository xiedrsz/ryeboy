<template>
  <div class="page"
       title="频道管理">
    <div class="page-content">
      <div class="own">
        <div class="title-row">
          <div>我的频道</div>
          <div class="mdl-layout-spacer"></div>
          <button-flat class="sideline"
                       text="编辑" />
        </div>
        <div class="channel-list">
          <span class="mdl-chip"
                v-for="item in subscribedChannels"><span class="mdl-chip__text">{{ item.name }}</span></span>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  computed: {
    authenticated() {
      return this.$store.state.user.authenticated;
    },
    subscribedChannels() {
      return this.$store.state.diary.channels;
    },
  },
  components: {
    "button-flat": require("components/ui/button-flat.vue"),
  }
};

</script>

<style lang="scss" scoped>
@import "~scss/main.scss";
.title-row {
  @include flex-row;
  width: 100%;
}

.channel-list {
  margin-top: 16px;
  @include flex-row;
  flex-wrap: wrap;
  width: 100%;
}

.mdl-chip {
  margin-right: 12px;
}

.sideline {
  border: 1px solid $color-disable
}
</style>