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
      <infinite-scroll ref="infiniteScroll"
                       v-if="infinite && nomore == false"
                       :onInfinite="internalInfinite">
        <div slot="error">(加载错误)</div>
      </infinite-scroll>
      <div class="nomore"
           v-if="infinite && nomore == true">(没有更多内容了)</div>
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
      loadstate: {
        type: String,
        default: "loading"
      },
      infinite: Function,
      pulltorefresh: Function
    },
    methods: {
      async internalInfinite(infiniteScroll) {
        try {
          await this.infinite();

          this.$nextTick(() => {
            if (this.nomore) {
              infiniteScroll.$emit("$InfiniteScroll:complete");
            } else {
              infiniteScroll.$emit("$InfiniteScroll:loaded");
            }
          });
        } catch (error) {
          infiniteScroll.$emit("$InfiniteScroll:error");
        }
      },
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
    }
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

  .nomore {
    @include flex-row;
    @include flex-center;
    margin-bottom: 32px;
    color: $color-hint-text;
  }
</style>