<template>
  <div class="page"
       title="问题">
    <loadable-content class="content-wrap keep-scroll-position"
                      :loadstate="loadstate">
      <div class="page-content">
        <div class="name">{{ answer.name }}</div>
        <div v-html="answer.content"
             class="content"></div>
      </div>
    </loadable-content>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loadstate: "loading",
        answer: Object,
      };
    },
    methods: {
      async load() {
        this.answer = await this.$store.dispatch("search_getAnswer", {
          id: this.$route.query.id
        });
        this.loadstate = "loaded";
      }
    },
    async activated() {
      this.loadstate = "loading";
      await this.load();
      this.__restorePosition();
    },
    mounted() {
      this.$app.adjustScrollableElement(".content-wrap");
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .name {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid $color-divider;
  }
</style>