<template>
  <div class="content-wrap">
    <ul class="mdl-list">
      <diary-item v-for="item in diaries"
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
</template>

<script>
  import _ from "lodash";

  export default {
    data() {
      return {
        diaries: [],
        nomore: true,
        last: new Date()
      };
    },
    methods: {
      async getData(userid, last, filter) {
        let res = await this.$app.api.getPersonalDiaries(userid, last, filter);
        let diaries = res.data;
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
        await this.getData(this.userid, this.last, "recommend");

        this.$nextTick(() => {
          if (this.nomore) {
            infiniteScroll.$emit("$InfiniteScroll:complete");
          } else {
            infiniteScroll.$emit("$InfiniteScroll:loaded");
          }
        });
      }
    },
    computed: {
      userid() {
        return this.$store.state.user._id;
      }
    },
    components: {
      "infinite-scroll": require("ui/infinite-scroll.vue"),
      "diary-item": require("components/pages/personal-diary/personal-diary-item.vue")
    },
    async mounted() {
      document.querySelector(".content-wrap").style.height = (document.querySelector("main").clientHeight -
        document.querySelector(".tabs").clientHeight - 1) + "px";

      this.$app.dialog.showLoading();
      await this.getData(this.userid, undefined, "recommend");
      this.$app.dialog.hideLoading();
    }
  };
</script>