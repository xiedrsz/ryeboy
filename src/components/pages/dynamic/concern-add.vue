<template>
  <div class="page" title="添加" actions='[{"text":"换一批","clickHandler":"concern-refresh"}]'>
    <swipe ref="swipe">
      <swipe-slide>
        <div class="slide-content">

          <list>
            <list-item v-for="(item, index) in newconcern" :text="item.username" lIcon="/img/default-avatar.png">
              <span slot="note" class="mdl-list__item-note" @click="cancelAdd(index, item.note, item.id)">{{item.note}}</span>
            </list-item>
          </list>

          <unusual-loading @dateReloader="getNewConcern"></unusual-loading>
          <!--<infinite-scroll v-if="true" :onInfinite="infinite">
            <div slot="no-more">没有更多内容了</div>
          </infinite-scroll>-->
        </div>
      </swipe-slide>
    </swipe>
  </div>
</template>

<script>
  export default {
    computed: {
      newconcern() {
        return this.$store.state.concern.newconcern;
      }
    },
    methods: {
      getNewConcern() {
          this.$store.dispatch("getNewConcern");
        },
        // 暂留
        infinite() {},
        // 取消/关注
        cancelAdd(index, note, userId) {
          let isCancel = note == "已关注",
            dispatch = isCancel ? "cancelConcern" : "addConcern";

          this.$store.dispatch(dispatch, {
            index,
            userId,
            type: "newconcern"
          });
        }
    },
    components: {
      "list": require("ui/list.vue"),
      "list-item": require("ui/list-item.vue"),
      "swipe": require("ui/swipe.vue"),
      "swipe-slide": require("ui/swipe-slide.vue"),
      "unusual-loading": require("ui/unusual-loading.vue"),
      "infinite-scroll": require("ui/infinite-scroll.vue"),
    },
    created() {
      this.getNewConcern();
    },
    mounted() {
      this.$on("concern-refresh", () => {
        this.getNewConcern();
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