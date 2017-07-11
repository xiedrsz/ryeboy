<template>
  <div class="page"
       :title="`第${$route.query.weekCount}周日记`">
    <loadable-content class="content-wrap"
                      :nomore="true"
                      :loadstate="context.loadstate">
      <ul class="mdl-list">
        <diary-item v-for="item in context.diaries"
                    :key="item._id"
                    :id="item._id"
                    :likeCount="item.likeCount"
                    :like="item.like"
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
        userid: String,
        context: {}
      };
    },
    methods: {
      async getData() {
        let res = await this.$app.api.getPersonalDiaries(this.userid, this.$app.userid, undefined, "week", this.$route.query);
        let diaries = res.data;
        if (diaries.length == 0) {
          return 0;
        }
        await this.$store.dispatch("diary_updateData", diaries);
        diaries = await this.$store.dispatch("diary_addMap", diaries);
        diaries.forEach(item => {
          this.context.diaries.push(item);
        });
        return diaries.length;
      },
      async load() {
        this.context = await this.$store.dispatch("diary_getUserData", {
          userid: this.userid,
          label: `week_${this.$route.query.weekCount}`
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
      "diary-item": require("components/pages/personal-diary/personal-diary-item.vue"),
      "loadable-content": require("ui/loadable-content.vue"),
    },
    async activated() {
      this.userid = this.$route.query.userid || this.$app.userid;
      await this.load();
    },
    mounted() {
      this.$app.adjustScrollableElement(".content-wrap");
    }
  };
</script>