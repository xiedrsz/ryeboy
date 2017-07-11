<template>
  <div class="content-wrap">
    <loadable-content :nomore="context.nomore"
                      :loadstate="context.loadstate">
      <div v-for="group in context.diaries"
           :key="group.title"
           class="month-block">
        <div class="title">{{ group.title }}</div>
        <div class="week-wrap">
          <div v-for="item in group.items"
               :key="item.picture"
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
      showWeekDiaries(item) {
        this.$router.push({
          path: "/pages/personal-diary-weekly-list",
          query: {
            userid: this.userid,
            week: item.week,
            year: item.year,
            weekCount: item.weekCount
          }
        });
      },
      async getData() {
        let res = await this.$app.api.getPersonalDiaries(this.userid, this.$app.userid, undefined, "all");
        let diaries = res.data;
        if (diaries.length == 0) {
          return 0;
        }
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
          this.context.diaries.push({
            title: key,
            items: value
          });
        });
        return -1;
      },
      async load() {
        this.context = await this.$store.dispatch("diary_getUserData", {
          userid: this.userid,
          label: "weekly"
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
      "loadable-content": require("ui/loadable-content.vue"),
    },
    async activated() {
      this.userid = this.$route.query.id || this.$store.state.user._id;
      await this.load();
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