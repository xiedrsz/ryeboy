<template>
  <div>
    <loadable-content class="content-wrap"
                      :nomore="nomore"
                      :loadstate="loadstate"
                      :infinite="infinite"
                      v-keep-scroll-position>
      <ul class="mdl-list">
        <li class="notice-container"
            v-for="item in items"
            :key="item._id">
          <div class="notice-text"
               v-html="item.escapedText"></div>
          <div class="notice-time">{{ item.time }}</div>
        </li>
      </ul>
    </loadable-content>
  </div>
</template>

<script>
  import _ from "lodash";

  export default {
    data() {
      return {
        items: [],
        loadstate: "unload",
        nomore: true,
        last: new Date()
      };
    },
    methods: {
      async getData(userid, last) {
        try {
          let lastFetchCommentMessageAt = localStorage[`${this.userid}_lastFetchCommentMessageAt`] || new Date();
          let res = await this.$app.api.getNotices(userid, "system", lastFetchCommentMessageAt, last);
          let items = res.data;

          if (items.length == 0) {
            this.loadstate = "empty";
            return;
          }

          items.forEach(item => {
            item.time = this.$app.datetime.formatDiaryCreated(item.createdAt);
            item.escapedText = this.$app.textHelper.escape(item.content);
            this.items.push(item);
          });

          this.nomore = items.length < this.$app.config.pageSize;
          this.last = _.last(items).createdAt;
          this.loadstate = "loaded";
        } catch (error) {
          this.loadstate = "error";
        }
      },
      async infinite(infiniteScroll) {
        try {
          await this.getData(this.userid, this.last);

          this.$nextTick(() => {
            if (this.nomore) {
              infiniteScroll.$emit("$InfiniteScroll:complete");
            } else {
              infiniteScroll.$emit("$InfiniteScroll:loaded");
            }
          });
        } catch (error) {
          infiniteScroll.$emit("$InfiniteScroll:complete");
        }
      }
    },
    components: {
      "infinite-scroll": require("ui/infinite-scroll.vue"),
      "loadable-content": require("ui/loadable-content.vue"),
    },
    async mounted() {
      document.querySelector(".content-wrap").style.height =
        (document.querySelector("main").clientHeight -
          document.querySelector(".tabs").clientHeight - 1) + "px";
      this.loadstate = "loading";
      await this.getData(this.userid);
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .notice-container {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid $color-divider;
  }

  .notice-container:last-child {
    border-bottom: none;
  }

  .notice-text {
    color: $color-text;
    font-size: 16px;
    margin-top: 8px;
  }

  .notice-time {
    color: $color-hint-text;
    font-size: 12px;
    margin-top: 8px;
  }
</style>