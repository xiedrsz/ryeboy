<template>
  <div class="page"
       title="我的日记">
    <div class="tabs">
      <div v-for="tab in tabs"
           class="tab-link"
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
        nomore: true
      };
    },
    methods: {
      infinite() {

      }
    },
    computed: {
      userid() {
        return this.$store.state.user._id;
      }
    },
    components: {
      "personal-diary-item": require("components/pages/personal-diary-item.vue"),
      "infinite-scroll": require("ui/infinite-scroll.vue"),
    },
    async mounted() {
      document.querySelector(".content-wrap").style.height = (document.querySelector("main").clientHeight -
        document.querySelector(".tabs").clientHeight - 1) + "px";

      this.$app.dialog.showLoading();
      let res = await this.$app.api.getPersonalDiaries("582c6af47236a860e8fffcb2");
      let diaries = res.data;
      await this.$store.dispatch("updateDiaries", diaries);
      this.nomore = diaries.length < this.$app.config.pageSize;
      this.diaries = diaries;
      this.$app.dialog.hideLoading();
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