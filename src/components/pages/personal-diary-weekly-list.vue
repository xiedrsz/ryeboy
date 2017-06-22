<template>
  <div class="page"
       :title="title">
    <div class="content-wrap" style="height:584px"
         v-keep-scroll-position>
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
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        diaries: [],
        title: "",
      };
    },
    methods: {
      async getData(userid) {
        let res = await this.$app.api.getPersonalDiaries(userid, undefined, "week", this.$route.query);
        let diaries = res.data;
        await this.$store.dispatch("updateDiaries", diaries);
        this.diaries = diaries;
      },
    },
    computed: {
      userid() {
        return this.$store.state.user._id;
      }
    },
    components: {
      "diary-item": require("components/pages/personal-diary/personal-diary-item.vue")
    },
    async mounted() {
      document.querySelector(".content-wrap").style.height = document.querySelector("main").clientHeight + "px";

      let weekCount = this.$route.query.weekCount;
      this.title = `第${weekCount}周日记`;

      this.$app.dialog.showLoading();
      await this.getData("582c6af47236a860e8fffcb2");
      this.$app.dialog.hideLoading();
    }
  };
</script>