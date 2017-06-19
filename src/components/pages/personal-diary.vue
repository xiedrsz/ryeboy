<template>
  <div class="page"
       title="我的日记">
    <div class="tabs">
      <div v-for="(tab, index) in tabs"
           class="tab-link"
           @click="clickTab(index)"
           :class="{ active: tab.active }">
        {{ tab.text }}
      </div>
    </div>
    <div v-if="tabIndex == 1">

    </div>
    <div class="content-wrap"
         v-else>
      <ul class="mdl-list">
        <personal-diary-item v-for="item in diaries"
                             :id="item._id"
                             :likeCount="item.likeCount"
                             :commentCount="item.commentCount"
                             :pictures="item.pictures"
                             :text="item.escapedText"
                             :time="item.time"
                             :date="item.dateWithoutYear"
                             :week="item.week" />
      </ul>
      <infinite-scroll v-if="nomore == false"
                       :onInfinite="infinite">
        <div slot="no-more">没有更多内容了</div>
      </infinite-scroll>
    </div>
  </div>
</template>

<script>
  import _ from "lodash";
  let refresh = false;

  export default {
    data() {
      return {
        tabs: [
          {
            text: "每天日记",
            active: true
          },
          {
            text: "每周日记",
            active: false
          },
          {
            text: "精品日记",
            active: false
          }
        ],
        tabIndex: 0,
        diaries: [],
        nomore: true,
        enableClickTab: true,
        filter: "",
        last: new Date()
      };
    },
    beforeRouteLeave(to, from, next) {
      // 保存滚动位置
      from.meta.scrollPosition = {
        "content-wrap": this.$el.querySelector(".content-wrap").scrollTop
      };
      next();
    },
    beforeRouteEnter(to, from, next) {
      if (from.name != "diary-detail") {
        refresh = true;
      }

      // 恢复滚动位置
      next(vm => {
        let scrollPosition = to.meta.scrollPosition;
        if (scrollPosition) {
          vm.$el.querySelector(".content-wrap").scrollTop = scrollPosition["content-wrap"];
        }
      });
    },
    methods: {
      async load() {
        this.diaries = [];
        this.nomore = true;
        this.filter = this.tabIndex == 2 ? "recommend" : "";
        this.$app.dialog.showLoading();
        await this.getData("582c6af47236a860e8fffcb2", undefined, this.filter);
        this.$app.dialog.hideLoading();
      },
      reload() {
        this.switchTab(0);
        this.load();
      },
      switchTab(index) {
        this.tabs[this.tabIndex].active = false;
        this.tabs[index].active = true;
        this.tabIndex = index;
      },
      clickTab(index) {
        if (!this.enableClickTab) {
          return;
        }
        if (this.tabIndex != index) {
          this.switchTab(index);
          this.load(index);
        }
      },
      async getData(userid, last, filter) {
        let res = await this.$app.api.getPersonalDiaries(userid, last, filter);
        let diaries = res.data;
        await this.$app.delay(1000);
        await this.$store.dispatch("updateDiaries", diaries);
        this.nomore = diaries.length < this.$app.config.pageSize;

        if (last) {
          diaries.forEach(item => {
            this.diaries.push(item);
          });
        } else {
          this.diaries = diaries;
        }
        this.last = _.last(diaries).date;
      },
      async infinite(infiniteScroll) {
        this.enableClickTab = false;
        await this.getData("582c6af47236a860e8fffcb2", this.last, this.filter);

        this.$nextTick(() => {
          if (this.nomore) {
            infiniteScroll.$emit("$InfiniteScroll:complete");
          } else {
            infiniteScroll.$emit("$InfiniteScroll:loaded");
          }

          this.enableClickTab = true;
        });
      }
    },
    activated() {
      if (refresh) {
        refresh = false;
        this.reload();
      }
    },
    computed: {
      userid() {
        return this.$store.state.user._id;
      }
    },
    components: {
      "personal-diary-item": require("components/pages/personal-diary/personal-diary-item.vue"),
      "infinite-scroll": require("ui/infinite-scroll.vue"),
    },
    async mounted() {
      document.querySelector(".content-wrap").style.height = (document.querySelector("main").clientHeight -
        document.querySelector(".tabs").clientHeight - 1) + "px";

      this.load(0);
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .tabs {
    height: 36px;
    min-height: 36px;
    @include flex-row;
    @include flex-vertical-center;
    border-bottom: 1px solid $color-divider;
    background-color: $color-hint-block;
  }

  .tab-link {
    margin-left: 16px;
  }

  .tab-link.active {
    color: $color-blue;
  }

  .content-wrap {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
</style>