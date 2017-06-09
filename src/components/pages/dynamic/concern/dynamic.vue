<template>
  <div class="page-main">
    <swipe ref="swipe">
      <swipe-slide>
        <div class="slide-content">
          <pull-to-refresh :disabled="disableRefresh" @pulltorefresh="pulltorefresh" />

          <ul class="mdl-list">
            <dynamic-item v-for="(item, index) in dynamic" :detail="item" @like="like(item.id)" @comment="comment($event,item.id)" />
          </ul>

          <unusual-loading :option.syn="loading" @reload="getDynamic"></unusual-loading>

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
            this.getDynamic();
          },
          getDynamic() {
            this.$store.dispatch("getDynamic");
          },
          infinite(infiniteScroll) {
            this.$store.dispatch("getMoreDiaries", infiniteScroll);
            // this.getDynamic();
          },
          // 点赞
          like(id) {
            this.$store.dispatch("like", id);
          },
          // 评论
          comment(event, id) {
            let option = {
              id,
              mess: event.mess
            };
            this.$store.dispatch("comment", option);
          }
      },
      components: {
        "unusual-loading": require("ui/unusual-loading.vue"),
        "spinner": require("ui/spinner.vue"),
        "swipe": require("ui/swipe.vue"),
        "swipe-slide": require("ui/swipe-slide.vue"),
        "pull-to-refresh": require("ui/pull-to-refresh.vue"),
        "dynamic-item": require("components/pages/dynamic/concern/dynamic-item.vue"),
        "diary-item": require("components/pages/home/diary-item.vue"),
        "infinite-scroll": require("ui/infinite-scroll.vue")
      },
      activated() {
        !this.dynamic[0] && this.getDynamic();
      },
      mounted() {
        // 调整动态列表高度
        let mainContentHeight = document.querySelector("main").clientHeight;
        this.slideContentHeight = (mainContentHeight - document.querySelector(".mdl-grid").clientHeight - 1) + "px";
        this.setSlideContentHeight();
      },
      beforeRouteLeave(to, from, next){
        //保存滚动的位置
        let positions = [];
        this.$el.querySelectorAll(".slide-content").forEach((item)=>{
          positions.push(item.scrollTop);
        })
        from.meta.scrollPosition = {
          "slide-content": _.reverse(positions)          
        } 
        console.log(from)       
        next();
      },
      beforeRouteEnter(to,from,next){
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