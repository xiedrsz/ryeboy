<template>
  <div class="page-main">
    <swipe ref="swipe">
      <swipe-slide>
        <div class="slide-content">
          <pull-to-refresh :disabled="disableRefresh" @pulltorefresh="pulltorefresh" />
          <ul class="mdl-list">
            <diary-item v-for="item in dynamic"
                        :key="item._id"
                        :id="item._id"
                        :userid="item.userid"
                        :like="item.like"
                        :likeCount="item.likeCount"
                        :commentCount="item.commentCount"
                        :avatar="item.avatar"
                        :username="item.username"
                        :pictures="item.pictures"
                        :verified="item.verified"
                        :text="item.escapedText"
                        :userlv="item.userlv"
                        :expectedExp="item.expectedExp"
                        :time="item.time">
            </diary-item>
          </ul>
          <unusual-loading :option.syn="loading" @reload="getDynamic"></unusual-loading>
          <infinite-scroll v-if="true" :onInfinite="infinite">
            <div slot="no-more">没有更多内容了</div>
          </infinite-scroll>
        </div>
      </swipe-slide>
    </swipe>
  </div>
</template>

<script>
  import _ from "lodash";

  export default {
    components: {
      "unusual-loading": require("ui/unusual-loading.vue"),
      "swipe": require("ui/swipe.vue"),
      "swipe-slide": require("ui/swipe-slide.vue"),
      "pull-to-refresh": require("ui/pull-to-refresh.vue"),
      "diary-item": require("components/pages/home/diary-item.vue"),
      "infinite-scroll": require("ui/infinite-scroll.vue")
    },
    data() {
      return {
        slideContentHeight: 0,
        disableRefresh: false
      };
    },
    computed: {
      // 关注动态
      dynamic() {
          return this.$store.state.concern.dynamic;
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
        pulltorefresh() {
          // this.getDynamic();
          this.$store.dispatch("getDynamic", {
            addType: 'unshift'
          });
        },
        getDynamic() {
          this.$store.dispatch("getDynamic");
        },
        infinite(infiniteScroll) {
          this.$store.dispatch("getDynamic", {
            addType: 'push',
            infiniteScroll
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

      // 添加
      let that = this;
      this.$app.toolbars.create([{
        text: "添加",
        click() {
          that.$router.push({
            path: '/dynamic/concern-add'
          });
        }
        }]);
    },
    mounted() {
      // 调整动态列表高度
      let mainContentHeight = document.querySelector("main").clientHeight;
      this.slideContentHeight = (mainContentHeight - document.querySelector(".mdl-grid").clientHeight - 1) + "px";
      this.setSlideContentHeight();
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
  
  .mdl-list {
    padding: 0;
    margin: 8px 16px;
  }
  
  .mdl-list li {
    margin-bottom: 32px;
  }
</style>