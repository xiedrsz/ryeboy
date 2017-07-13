<template>
  <div class="content-wrap">
    <ul class="mdl-list">

    </ul>
    <infinite-scroll v-if="nomore == false"
                     :onInfinite="infinite">
      <div slot="no-more">没有更多内容了</div>
    </infinite-scroll>
  </div>
</template>

<script>
  import _ from "lodash";

  export default {

  };
</script>