<template>
  <div>
    <pull-to-refresh :disabled="disabled"
                     @pulltorefresh="pulltorefresh"></pull-to-refresh>
    <div v-if="loadstate == 'unload'"
         class="unload">
      (未加载)
    </div>
    <div v-else-if="loadstate == 'error'"
         class="loadstate">
      (加载错误)
    </div>
    <div v-else-if="loadstate == 'empty'"
         class="loadstate">
      (无内容)
    </div>
    <div v-else-if="loadstate == 'loading'"
         class="loadstate">
      <spinner></spinner>
    </div>
    <div v-else>
      <ul class="mdl-list">
        <slot></slot>
      </ul>
      <infinite-scroll v-if="nomore == false"
                       :onInfinite="infinite">
        <div slot="no-more">没有更多内容了</div>
      </infinite-scroll>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      nomore: Boolean,
      disabled: Boolean,
      loadstate: String,
      infinite: Function,
      pulltorefresh: Function
    },
    components: {
      "spinner": require("ui/spinner.vue"),
      "pull-to-refresh": require("ui/pull-to-refresh.vue"),
      "infinite-scroll": require("ui/infinite-scroll.vue"),
    },
  };
</script>