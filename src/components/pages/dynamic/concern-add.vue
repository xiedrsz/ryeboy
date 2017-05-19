<template>
  <div class="page" title="添加" actions='[{"text":"换一批","clickHandler":"concern-refresh"}]'>
    <list>
      <list-item text="苹果" note="关注" lIcon="/img/default-avatar.png" />
    </list>
  </div>
</template>

<script>
  import _ from "lodash";

  export default {
    data() {
        return {
          slideContentHeight: 0
        };
      },
      computed: {

      },
      methods: {

      },
      components: {
        "list": require("ui/list.vue"),
        "list-item": require("ui/list-item.vue")
      },
      mounted() {
        this.$on("concern-refresh", () => {
          console.log("换一批")
        })
      }
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .mdl-list {
    padding: 0 16px;
  }
  
  .mdl-list__item {
    padding: 16px 0;
  }
  
  .slide-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .loadstate {
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