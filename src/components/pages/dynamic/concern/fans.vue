<template>
  <div class="page-main">
    <swipe @slidechanged="slideChanged" ref="swipe">
      <swipe-slide>
        <div class="slide-content">
          <pull-to-refresh :disabled="disableRefresh" @pulltorefresh="pulltorefresh" />
          <list>
            <list-item v-for="item in fans" :text="item.username" lIcon="/img/default-avatar.png" />
          </list>
          <div v-if="false" class="unload">
            (未加载)
          </div>
          <div v-else-if="false" class="loadstate">
            (加载错误)
          </div>
          <div v-else-if="false" class="loadstate">
            (无内容)
          </div>
          <div v-else-if="false" class="loadstate">
            <spinner />
          </div>
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
    data() {
        return {
          slideContentHeight: 0
        };
      },
      computed: {
        disableRefresh() {
            let state = this.$store.getters.getChannelLoadstate;
            return !(state == "ok" || state == "error" || state == "empty");
          },
          fans() {
            return this.$store.state.concern.fans;
          }
      },
      methods: {
        setSlideContentHeight() {
            document.querySelector(".slide-content").style.height = this.slideContentHeight;
          },
          pulltorefresh() {
            this.$store.commit(types.SET_RELOAD);
            this.getDiaries();
          },
          slideChanged() {
            this.getDiaries();
          },
          getDiaries() {
            this.$store.dispatch("getDiaries");
          },
          infinite(infiniteScroll) {
            console.log("KKK")
            this.$store.dispatch("getMoreDiaries", infiniteScroll);
          }
      },
      components: {
        "spinner": require("ui/spinner.vue"),
        "swipe": require("ui/swipe.vue"),
        "swipe-slide": require("ui/swipe-slide.vue"),
        "pull-to-refresh": require("ui/pull-to-refresh.vue"),
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
            this.$refs.swipe.reset();
            this.slideChanged(0);
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
  .mdl-list__item{
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