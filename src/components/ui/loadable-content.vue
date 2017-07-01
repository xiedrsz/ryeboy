<template>
  <div>
    <pull-to-refresh v-if="pulltorefresh"
                     :disabled="disabled"
                     @pulltorefresh="pulltorefresh">
    </pull-to-refresh>
    <div v-if="loadstate == 'unload'"
         class="unload">
      (未加载)
    </div>
    <div v-else-if="loadstate == 'error'"
         class="error">
      (加载错误)
    </div>
    <div v-else-if="loadstate == 'empty'"
         class="empty">
      (无内容)
    </div>
    <div v-else-if="loadstate == 'loading'"
         class="loading">
      <spinner></spinner>
    </div>
    <div v-else>
      <slot></slot>
      <infinite-scroll v-if="infinite && nomore == false"
                       :onInfinite="infinite">
        <div slot="no-more">没有更多内容了</div>
      </infinite-scroll>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      nomore: {
        type: Boolean,
        default: true
      },
      loadstate: String,
      infinite: Function,
      pulltorefresh: Function,
    },
    computed: {
      disabled() {
        return !(this.loadstate == "loaded" || this.loadstate == "error" || this.loadstate == "empty");
      }
    },
    components: {
      "spinner": require("ui/spinner.vue"),
      "pull-to-refresh": require("ui/pull-to-refresh.vue"),
      "infinite-scroll": require("ui/infinite-scroll.vue"),
    },
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .loading,
  .error,
  .empty {
    @include flex-row;
    @include flex-center;
    height: 128px;
  }

  .unload {
    @include flex-row;
    @include flex-center;
    height: 256px;
    color: $color-hint-text;
  }
</style>