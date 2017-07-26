<template>
  <div>
    <loadable-content class="content-wrap keep-scroll-position"
                      :nomore="nomore"
                      :loadstate="loadstate"
                      :infinite="infinite">
      <ul class="mdl-list">
        <diary-item v-for="item in items"
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
                    :time="item.time"></diary-item>
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
        loadstate: "loading",
        nomore: true,
        last: Date
      };
    },
    methods: {
      async getData(last) {
        let userid = this.$app.userid;
        let res = await this.$app.api.getFavorites(userid, last);
        let items = res.data;

        if (items.length == 0) {
          this.nomore = true;
          return 0;
        }

        await this.$store.dispatch("diary_ensureUsers", items);
        await this.$store.dispatch("diary_updateData", items);
        items = await this.$store.dispatch("diary_addMap", items);
        items.forEach(item => this.items.push(item));

        this.nomore = items.length < this.$app.config.pageSize;
        this.last = _.last(items).createdAt;

        return items.length;
      },
      async infinite() {
        await this.getData(this.last);
      }
    },
    components: {
      "diary-item": require("components/pages/home/diary-item.vue"),
    },
    async activated() {
      this.$app.restorePosition(this.$el);
    },
    async mounted() {
      this.$app.adjustScrollableElement(".content-wrap", [".tabs"]);

      try {
        let count = await this.getData();
        this.loadstate = count == 0 ? "empty" : "loaded";
      } catch (error) {
        this.loadstate = "error";
      }
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  @import "~scss/diary-item.scss";
  .mdl-list {
    padding: 0;
    margin: 16px;
  }

  .mdl-list li {
    margin-bottom: 32px;
  }
</style>