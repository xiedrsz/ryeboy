<template>
  <div class="page"
       :title="$route.query.title">
    <loadable-content class="content-wrap keep-scroll-position"
                      :nomore="context.nomore"
                      :loadstate="context.loadstate"
                      :infinite="infinite">
      <ul class="mdl-list">
        <li v-for="item in context.items"
            class="answer-item"
            :key="item._id">
          <div>
            {{ item.name}}
          </div>
        </li>
      </ul>
    </loadable-content>
  </div>
</template>

<script>
  import _ from "lodash";
  const defaultContext = {
    items: [],
    loadstate: "loading",
    nomore: true,
    last: undefined,
  };

  export default {
    data() {
      return {
        context: _.cloneDeep(defaultContext)
      };
    },
    methods: {
      async infinite() {
        await this.$store.dispatch("search_getAnswers_data", {
          type: this.$route.query.type,
          context: this.context
        });
      },
      async load() {
        let type = this.$route.query.type;
        this.context = await this.$store.dispatch("search_getAnswers", {
          type,
          defaultContext: _.cloneDeep(defaultContext)
        });
        await this.$store.dispatch("search_getAnswers_logic", type);
      }
    },
    components: {
      "loadable-content": require("ui/loadable-content.vue"),
    },
    async activated() {
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
  .answer-item {
    @include flex-row;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid $color-divider;
  }
</style>