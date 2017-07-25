<template>
  <div class="content-wrap keep-scroll-position">
    <loadable-content :nomore="context.nomore"
                      :loadstate="context.loadstate"
                      :infinite="infinite">
      <ul class="mdl-list">
        <personal-diary-item v-for="item in context.diaries"
                    :key="item._id"
                    :id="item._id"
                    :likeCount="item.likeCount"
                    :like="item.like"
                    :commentCount="item.commentCount"
                    :pictures="item.pictures"
                    :text="item.escapedText"
                    :time="item.time"
                    :date="item.dateWithoutYear"
                    :week="item.week"></personal-diary-item>
      </ul>
    </loadable-content>
  </div>
</template>

<script>
  import _ from "lodash";

  export default {
    data() {
      return {
        userid: String,
        context: {}
      };
    },
    methods: {
      async getData(last) {
        let res = await this.$app.api.getPersonalDiaries(this.userid, this.$app.userid, last, "recommend");
        let diaries = res.data;
        if (diaries.length == 0) {
          this.context.nomore = true;
          return 0;
        }
        await this.$store.dispatch("diary_updateData", diaries);
        diaries = await this.$store.dispatch("diary_addMap", diaries);
        this.context.nomore = diaries.length < this.$app.config.pageSize;

        diaries.forEach(item => {
          this.context.diaries.push(item);
        });
        this.context.last = _.last(diaries).date;

        return diaries.length;
      },
      async infinite() {
        await this.getData(this.context.last);
      },
      async load() {
        this.context = await this.$store.dispatch("diary_getUserData", {
          userid: this.userid,
          label: "recommend"
        });

        if (["loaded", "empty"].indexOf(this.context.loadstate) != -1) {
          return;
        }

        try {
          let count = await this.getData();
          this.context.loadstate = count == 0 ? "empty" : "loaded";
        } catch (error) {
          this.context.loadstate = "error";
        }
      }
    },
    components: {
      "personal-diary-item": require("components/pages/personal-diary/personal-diary-item.vue"),
    },
    async activated() {
      this.userid = this.$route.query.id || this.$app.userid;
      await this.load();
      this.$nextTick(() => {
        this.$app.restorePosition(this.$el, this.$route.query.id);
      });
    }
  };
</script>