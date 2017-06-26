<template>
  <div class="content-wrap">
    <ul class="mdl-list">

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
        items: [],
        nomore: true,
        last: new Date()
      };
    },
    methods: {
      async getData(userid) {
        try {
          let lastFetchCommentMessageAt = localStorage[`${this.userid}_lastFetchCommentMessageAt`] || new Date();
          let res = await this.$app.api.getNotices(userid, lastFetchCommentMessageAt, "comment");
          let items = res.data;
          console.log(items);
        } catch (error) {
          this.$app.dialog.text("error");
        }

        // if (diaries.length == 0) {
        //   return;
        // }
        // await this.$store.dispatch("updateDiaries", diaries);
        // this.nomore = diaries.length < this.$app.config.pageSize;

        // if (last) {
        //   diaries.forEach(item => {
        //     this.diaries.push(item);
        //   });
        // } else {
        //   this.diaries = diaries;
        // }
        // this.last = _.last(diaries).date;
      },
      async infinite(infiniteScroll) {
        await this.getData(this.userid, this.last);

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
      // "item": require("components/pages/message/message-comment-item.vue")
    },
    async mounted() {
      document.querySelector(".content-wrap").style.height = (document.querySelector("main").clientHeight -
        document.querySelector(".tabs").clientHeight - 1) + "px";

      this.$app.dialog.showLoading();
      await this.getData(this.userid);
      this.$app.dialog.hideLoading();
    }
  };
</script>