<template>
  <div class="content-wrap">
    <div v-for="group in diaries"
         class="month-block">
      <div class="title">{{ group.title }}</div>
      <div class="week-wrap">
        <div v-for="item in group.items"
             class="week-block">
          <div class="cover"
               @click="showWeekDiaries(item)">
            <img :data-src="item.picture"
                 class="lazyload">
          </div>
          <div class="statistics">
            第{{ item.weekCount }}周
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from "lodash";

  export default {
    data() {
      return {
        diaries: []
      };
    },
    methods: {
      showWeekDiaries(item) {
        this.$router.push({
          path: "/pages/personal-diary-weekly-list",
          query: {
            month: item.month,
            year: item.year,
            weekCount: item.weekCount
          }
        });
      },
      async getData(userid, last, filter) {
        let res = await this.$app.api.getPersonalDiaries(userid, last, filter);
        let diaries = res.data;
        let index = diaries.length;
        diaries.forEach(item => {
          item.weekCount = index;
          if (item.pictures && item.pictures.length > 0) {
            item.picture = this.$app.textHelper.getPictureUrl(item.pictures[0]);
          } else {
            item.picture = require("img/default-avatar.png");
          }
          index--;
        });
        _.each(_.groupBy(diaries, item => {
          return item.year + "年" + item.month + "月";
        }), (value, key) => {
          this.diaries.push({
            title: key,
            items: value
          });
        });
      },
    },
    computed: {
      userid() {
        return this.$store.state.user._id;
      }
    },
    async mounted() {
      document.querySelector(".content-wrap").style.height = (document.querySelector("main").clientHeight -
        document.querySelector(".tabs").clientHeight - 1) + "px";

      this.$app.dialog.showLoading();
      await this.getData("582c6af47236a860e8fffcb2", undefined, "all");
      // await this.getData(this.userid, undefined, "all");

      this.$app.dialog.hideLoading();
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .month-block {
    padding: 16px;
  }

  .week-wrap {
    @include flex-row;
    @include flex-wrap;
    margin-top: 8px;
  }

  .week-block {
    margin-bottom: 8px;
  }

  .statistics {
    text-align: center;
    color: $color-hint-text;
    font-size: 12px;
  }

  .cover {
    margin-right: 3px;
    margin-bottom: 8px;
  }

  .cover img {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }
</style>