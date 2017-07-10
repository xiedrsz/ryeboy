<template>
  <div class="page"
       title="点赞">
    <loadable-content class="content-wrap"
                      :nomore="nomore"
                      :loadstate="loadstate"
                      :infinite="infinite"
                      v-keep-scroll-position>
      <ul class="mdl-list">
        <li v-for="item in items"
            :key="item.userid"
            class="item-container">
          <div class="diary-avatar">
            <img :data-src="item.avatar"
                 class="lazyload">
          </div>
          <div class="diary-main">
            <div class="diary-username">
              <img v-if="item.verified"
                   :src="require('img/v.png')"
                   class="diary-v">
              <span>{{ item.username }}</span>
              <span class="diary-userlv">{{ item.userlv }}</span>
            </div>
          </div>
        </li>
      </ul>
    </loadable-content>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        items: [],
        nomore: true,
        loadstate: "loading",
        last: 0
      };
    },
    methods: {
      async infinite() {
        await this.getData();
      },
      async getData() {
        let res = await this.$app.api.getLikes(this.$route.query.id, this.last);
        let items = res.data;

        if (items.length == 0) {
          this.nomore = true;
          return 0;
        }

        await this.$store.dispatch("diary_ensureUsers", items);
        await this.$store.dispatch("diary_updateUserInfo", items);
        this.last += items.length;
        this.nomore = items.length < this.$app.config.pageSize;

        items.forEach(item => {
          this.items.push(item);
        });

        return items.length;
      },
    },
    components: {
      "loadable-content": require("ui/loadable-content.vue"),
    },
    async mounted() {
      this.$app.adjustScrollableElement(".content-wrap");

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
  @import "~scss/diary-item.scss";
  .item-container {
    @include flex-row;
  }

  .mdl-list {
    margin: 16px 16px;
  }

  .mdl-list li {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid $color-divider;
  }

  .mdl-list li:last-child {
    border-bottom: none;
  }
</style>