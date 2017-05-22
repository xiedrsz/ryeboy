<template>
  <div class="page-main">
    <swipe ref="swipe">
      <swipe-slide>
        <div class="slide-content">
          <list>
            <list-item v-for="item in concern" :text="item.username" note="取消" lIcon="/img/default-avatar.png" />
          </list>
          <unusual-loading @dateReloader="getConcern"></unusual-loading>
          <!--<infinite-scroll v-if="true" :onInfinite="infinite">
            <div slot="no-more">没有更多内容了</div>
          </infinite-scroll>-->
        </div>
      </swipe-slide>
    </swipe>
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
        concern() {
          return this.$store.state.concern.concern;
        }
      },
      methods: {
        setSlideContentHeight() {
            document.querySelector(".slide-content").style.height = this.slideContentHeight;
          },
          getConcern() {
            this.$store.dispatch("getConcern");
          },
          infinite(infiniteScroll) {
            console.log("Todo");
            // Todo
            this.$store.dispatch("getMoreDiaries", infiniteScroll);
          }
      },
      components: {
        "unusual-loading": require("ui/unusual-loading.vue"),
        "swipe": require("ui/swipe.vue"),
        "swipe-slide": require("ui/swipe-slide.vue"),
        "dynamic-item": require("components/pages/dynamic/concern/dynamic-item.vue"),
        "infinite-scroll": require("ui/infinite-scroll.vue"),
        "list": require("ui/list.vue"),
        "list-item": require("ui/list-item.vue")
      },
      deactivated() {},
      activated() {
        if (true) {
          this.setSlideContentHeight();
          setTimeout(() => {
            // this.$refs.swipe.reset();
            this.getConcern();
          }, 0);
        }
      },
      mounted() {
        // 调整动态列表高度
        let mainContentHeight = document.querySelector("main").clientHeight;
        this.slideContentHeight = (mainContentHeight - document.querySelector(".mdl-grid").clientHeight - 1) + "px";
        this.setSlideContentHeight();
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