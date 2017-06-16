<template>
  <div class="page"
       title="我的日记">
    <div class="tabs">
      <div v-for="tab in tabs"
           class="tab-link"
           :class="{ active: tab.active }">
        {{ tab.text }}
      </div>
    </div>
    <div v-if="tabIndex == 1">

    </div>
    <div v-else>
      <ul class="mdl-list">
        <personal-diary-item v-for="item in diaries"
                             :id="item._id"
                             :likeCount="item.likeCount"
                             :commentCount="item.commentCount"
                             :username="item.username"
                             :pictures="item.pictures"
                             :verified="item.verified"
                             :text="item.escapedText"
                             :time="item.time" />
      </ul>
      <infinite-scroll v-if="nomore == false"
                       :onInfinite="infinite">
        <div slot="no-more">没有更多内容了</div>
      </infinite-scroll>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tabs: [
          {
            text: "每天日记",
            active: true
          },
          {
            text: "每周日记",
            active: false
          },
          {
            text: "精品日记",
            active: false
          }
        ],
        tabIndex: 0,
        diaries: [],
        nomore: true
      };
    },
    methods: {
      infinite() {

      },
      async delay() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 2000);
        });
      }
    },
    computed: {
      userid() {
        console.log(this.$store);
        return this.$store.state.user._id;
      }
    },
    components: {
      "personal-diary-item": require("components/pages/personal-diary-item.vue"),
      "infinite-scroll": require("ui/infinite-scroll.vue"),
    },
    async mounted() {
      this.$app.dialog.showLoading();
      await this.delay();
      console.log(this.userid);
      let res = await this.$app.api.getPersonalDiaries(this.userid);
      console.log(res);
      let diaries = res.data;
      console.log(diaries);
      await this.$store.dispatch("updateDiaries", diaries);
      this.diaries = diaries;
      this.$app.dialog.hideLoading();
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .tabs {
    height: 36px;
    min-height: 36px;
    @include flex-row;
    @include flex-vertical-center;
    border-bottom: 1px solid $color-divider;
    background-color: $color-hint-block;
  }

  .tab-link {
    margin-left: 16px;
  }

  .tab-link.active {
    color: $color-blue;
  }
</style>