<template>
  <loadable-content class="content-wrap keep-scroll-position"
                    :nomore="true"
                    :loadstate="loadstate">
    <div class="default-content"
         v-show="!hasSearchResult">
      <div class="info">用户搜索仅匹配开头相同的用户名</div>
    </div>
    <ul class="mdl-list"
        v-show="hasSearchResult">
      <li v-for="item in searchResult"
          class="search-item"
          @click.stop="$router.push('/pages/user-detail?id=' + item._id)"
          :key="item._id">
        <div>
          {{ item.username}}
        </div>
      </li>
    </ul>
  </loadable-content>
</template>

<script>
  export default {
    data() {
      return {
        loadstate: "loading",
        hasSearchResult: false,
        searchResult: []
      };
    },
    watch: {
      keyword(newValue) {
        if (newValue == "") {
          this.hasSearchResult = false;
        }
      }
    },
    computed: {
      keyword() {
        return this.$store.state.search.keyword;
      }
    },
    methods: {
      showSearchResult(data) {
        this.hasSearchResult = true;
        this.searchResult = data;
      },
      async getData() {
        return 1;
      }
    },
    async activated() {
      this.$nextTick(() => {
        this.$app.restorePosition(this.$el);
      });
    },
    async mounted() {
      this.$app.adjustScrollableElement(".content-wrap", [".tabs"]);
      
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

  .search-item {
    padding-bottom: 8px;
    margin-bottom: 12px;
    border-bottom: 1px solid $color-divider;
  }

  .info {
    font-size: 14px;
    color: $color-hint-text;
  }
</style>