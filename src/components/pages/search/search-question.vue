<template>
  <loadable-content class="content-wrap keep-scroll-position"
                    :nomore="true"
                    :loadstate="loadstate">
    <div class="default-content">
      <div class="recommend-section">
        <div class="head">热点问题</div>
        <div class="recommend-item"
             v-for="item in recommends"
             :key="item._id">
          <div>{{ item.name }}</div>
        </div>
      </div>
      <div>
        <div class="head">问题分类</div>
        <div class="type-wrap">
          <span class="mdl-chip"
                v-for="item in types"
                :key="item._id"
                @click="showAnswerList(item)">
            <span class="mdl-chip__text">{{ item.name }}</span>
          </span>
        </div>
        <div class="head">提出问题</div>
        <div>体验不好想吐槽？
          <span @click="$router.push('/pages/feedback')"
                class="feedback">开始吐槽</span>
        </div>
      </div>
    </div>
  </loadable-content>
</template>

<script>
  import _ from "lodash";

  export default {
    data() {
      return {
        recommends: [],
        types: [],
        loadstate: "loading",
      };
    },
    methods: {
      showAnswerList(item) {
        this.$router.push(`/pages/answer-list?title=${item.name}&type=${item._id}`);
      },
      adjustHeight() {
        this.$app.adjustScrollableElement(".content-wrap", [".tabs"]);
      },
      async getData() {
        this.types = await this.$store.dispatch("search_getAnswerTypes");
        this.recommends = await this.$store.dispatch("search_getRecommendAnswers");

        return this.types.length + this.recommends.length;
      }
    },
    components: {
      "loadable-content": require("ui/loadable-content.vue"),
    },
    async activated() {
      this.$nextTick(() => {
        this.$app.restorePosition(this.$el);
      });
    },
    async mounted() {
      this.adjustHeight();

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
  .default-content {
    padding: 16px;
  }

  .head {
    padding-bottom: 8px;
    margin-bottom: 12px;
    border-bottom: 1px solid $color-disable;
    color: $color-hint-text;
  }

  .recommend-item {
    padding-bottom: 8px;
    margin-bottom: 12px;
    border-bottom: 1px solid $color-divider;
  }

  .recommend-section {
    margin-bottom: 32px;
  }

  .type-wrap {
    @include flex-row;
    @include flex-wrap;
    margin-bottom: 32px;
  }

  .mdl-chip {
    margin-right: 16px;
    margin-bottom: 8px;
  }

  .feedback {
    color: $color-blue;
  }
</style>