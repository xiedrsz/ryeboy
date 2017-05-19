<template>
  <div class="page-main">
    <swipe @slidechanged="slideChanged" ref="swipe">
      <swipe-slide>
        <div class="slide-content">
          <pull-to-refresh :disabled="disableRefresh" @pulltorefresh="pulltorefresh" />
          <ul class="mdl-list">
            <dynamic-item v-for="item in dynamic" :likeCount="item.likeCount" :commentCount="item.commentCount" :avatar="item.avatar" :username="item.username" :text="item.escapedText" :time="item.time" :overflow="item.overflow" />
          </ul>
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
          <infinite-scroll v-if="false" :onInfinite="infinite">
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
          slideContentHeight: 0,
          disableRefresh: false
        };
      },
      computed: {
        // 关注动态
        dynamic() {
          return this.$store.state.concern.dynamic;
        }
      },
      methods: {
        setSlideContentHeight() {
            document.querySelector(".slide-content").style.height = this.slideContentHeight;
          },
          pulltorefresh() {
            this.getDynamic();
          },
          slideChanged() {
            this.getDynamic();
          },
          getDynamic() {
            this.$store.dispatch("getDynamic");
          },
          infinite(infiniteScroll) {
            this.$store.dispatch("getMoreDiaries", infiniteScroll);
          }
      },
      components: {
        "spinner": require("ui/spinner.vue"),
        "swipe": require("ui/swipe.vue"),
        "swipe-slide": require("ui/swipe-slide.vue"),
        "pull-to-refresh": require("ui/pull-to-refresh.vue"),
        "dynamic-item": require("components/pages/dynamic/concern/dynamic-item.vue"),
        "diary-item": require("components/pages/home/diary-item.vue"),
        "infinite-scroll": require("ui/infinite-scroll.vue")
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

        /*let fulltext = document.getElementsByClassName('text')
        for(let t=0;t<fulltext.length;t++){
          fulltext[t].clientHeight == 60 ? this.dynamic[t].overflow = true : this.dynamic[t].overflow = false
        } 
        console.log(this.dynamic[0].overflow)  */
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