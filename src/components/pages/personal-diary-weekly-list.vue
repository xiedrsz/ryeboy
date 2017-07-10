<template>
  <div class="page"
       :title="title">
    <loadable-content class="content-wrap"
                      :nomore="true"
                      :loadstate="loadstate"
                      v-keep-scroll-position>
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
  export default {
    data() {
      return {
        diaries: [],
        title: "",
        loadstate: "loading"
      };
    },
    methods: {
      async getData(userid) {
        let res = await this.$app.api.getPersonalDiaries(userid, undefined, "week", this.$route.query);
        let diaries = res.data;
        if (diaries.length == 0) {
          this.loadstate = "empty";
          return;
        }
        await this.$store.dispatch("diary_updateData", diaries);
        this.diaries = diaries;
        this.loadstate = "loaded";
      },
    },
    computed: {
      userid() {
        let userid = this.$route.query.userid;
        if (userid) {
          return userid;
        } else {
          return this.$store.state.user._id;
        }
      }
    },
    components: {
      "diary-item": require("components/pages/personal-diary/personal-diary-item.vue"),
      "loadable-content": require("ui/loadable-content.vue"),
    },
    async mounted() {
      this.$app.adjustScrollableElement(".content-wrap");

      let weekCount = this.$route.query.weekCount;
      this.title = `第${weekCount}周日记`;

      await this.getData(this.userid);
    }
  };
</script>