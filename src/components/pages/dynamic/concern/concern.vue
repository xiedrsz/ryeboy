<template>
  <div class="page-main">
    <swipe ref="swipe">
      <swipe-slide>
        <div class="slide-content">
          <list>
            <list-item class="member-item" v-for="(item, index) in concern"
                       @click.native="$router.push('/pages/user-detail?id=' + item.id)"
                       :text="item.username"
                       :lIcon="item.avatar">
              <span slot="note" class="mdl-list__item-note"
                    @click.stop="cancelAdd(index, item.note, item.id)">
                {{item.note}}
              </span>
            </list-item>
          </list>

          <unusual-loading :option.syn="loading" @dateReloader="getConcern"></unusual-loading>
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
    data() {
        return {
          slideContentHeight: 0
        };
      },
      computed: {
        concern() {
            return this.$store.state.concern.concern;
          },
          // loading 组件
          loading() {
            return this.$store.state.concern.loading;
          }
      },
      methods: {
        setSlideContentHeight() {
            document.querySelector(".slide-content").style.height = this.slideContentHeight;
          },
          // 获取关注人
          getConcern() {
            this.$store.dispatch("getConcern");
          },
          infinite(infiniteScroll) {
            // Todo
          },
          // 取消/关注
          cancelAdd(index, note, userId) {
            let isCancel = note == "取消",
              dispatch = isCancel ? "cancelConcern" : "addConcern";

            this.$store.dispatch(dispatch, {
              index,
              userId,
              type: "concern"
            });
          }
      },
      activated() {
        this.$store.commit("save_loading", {
          no: false,
          err: false,
          none: false,
          icon: false
        });

        !this.concern[0] && this.getConcern();
        
        // 添加
        let that = this;
        this.$app.toolbars.create([{
          text: "添加",
          click () {
            that.$router.push({
              path: '/dynamic/concern-add'
            });
          }
        }]);
      },
      deactivated() {
        this.$store.commit("concern_filterConcern");
      },
      mounted() {
        // 调整动态列表高度
        let mainContentHeight = document.querySelector("main").clientHeight;
        this.slideContentHeight = (mainContentHeight - document.querySelector(".mdl-grid").clientHeight - 1) + "px";
        this.setSlideContentHeight();
      },
      components: {
        "unusual-loading": require("ui/unusual-loading.vue"),
        "swipe": require("ui/swipe.vue"),
        "swipe-slide": require("ui/swipe-slide.vue"),
        "infinite-scroll": require("ui/infinite-scroll.vue"),
        "list": require("ui/list.vue"),
        "list-item": require("ui/list-item.vue")
      },
      beforeRouteLeave(to, from, next) {
        //保存滚动的位置
        let positions = [];
        this.$el.querySelectorAll(".slide-content").forEach((item) => {
          positions.push(item.scrollTop);
        })
        from.meta.scrollPosition = {
          "slide-content": _.reverse(positions)
        }
        next();
      },
      beforeRouteEnter(to, from, next) {
        // 恢复滚动位置
        next(vm => {

          let scrollPosition = to.meta.scrollPosition;

          if (scrollPosition) {
            vm.$el.querySelectorAll(".slide-content").forEach(item => {
              item.scrollTop = scrollPosition["slide-content"].pop();
            });
          }
        });
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