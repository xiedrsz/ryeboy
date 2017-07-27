<template>
  <div class="page" title="添加">
    <swipe ref="swipe">
      <swipe-slide>
        <div class="slide-content">

          <list>
            <div v-for="(item, index) in newconcern" class="member-item">
              <user-item :id="item.id" class="flex">
                <template scope="props">
                  <list-item 
                   @click.native="$router.push('/pages/user-detail?id=' + item.id)"
                   :text="props.user.username"
                   :lIcon="props.user.avatar">
                    <span slot="note" class="mdl-list__item-note" @click.stop="cancelAdd(index, item.note, item.id)">{{item.note}}</span>
                  </list-item>
                </template>
              </user-item>
            </div>
          </list>

          <unusual-loading :option.syn="loading" @reload="getNewConcern"></unusual-loading>
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
        },
        loading() {
          return this.$store.state.concern.loading;
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
      this.$store.commit("save_loading", {
        no: false,
        err: false,
        none: false,
        icon: false
      });
      this.getNewConcern();
    },
    activated() {
      this.$app.toolbars.create([{
        text: "换一批",
        click: this.getNewConcern
      }]);
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