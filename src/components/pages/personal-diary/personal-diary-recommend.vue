<template>
  <div class="content-wrap">
    <loadable-content :nomore="nomore"
                      :loadstate="loadstate"
                      :infinite="infinite">
      <ul class="mdl-list">
        <diary-item v-for="item in diaries"
                    :key="item._id"
                    :id="item._id"
                    :likeCount="item.likeCount"
                    :commentCount="item.commentCount"
                    :pictures="item.pictures"
                    :text="item.escapedText"
                    :time="item.time"
                    :date="item.dateWithoutYear"
                    :week="item.week"></diary-item>
      </ul>
    </loadable-content>
  </div>
</template>

<script>
  import _ from "lodash";

  export default {
    data() {
      return {
        diaries: [],
        loadstate: "loading",
        nomore: true,
        last: new Date()
      };
    },
    methods: {
      async getData(userid, last, filter) {
        let res = await this.$app.api.getPersonalDiaries(userid, last, filter);
        let diaries = res.data;
        if (diaries.length == 0) {
          this.nomore = true;
          return 0;
        }
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

        return diaries.length;
      },
      async infinite() {
        await this.getData(this.userid, this.last, "recommend");
      }
    },
    computed: {
      userid() {
        let userid = this.$route.query.id;
        if (userid) {
          return userid;
        } else {
          return this.$store.state.user._id;
        }
      }
    },
    components: {
      "infinite-scroll": require("ui/infinite-scroll.vue"),
      "diary-item": require("components/pages/personal-diary/personal-diary-item.vue"),
      "loadable-content": require("ui/loadable-content.vue"),
    },
    async mounted() {
      try {
        let count = await this.getData(this.userid, undefined, "recommend");
        this.loadstate = count == 0 ? "empty" : "loaded";
      } catch (error) {
        this.loadstate = "error";
      }
    }
  };
</script>