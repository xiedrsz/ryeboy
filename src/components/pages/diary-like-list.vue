<template>
  <div class="page"
       title="点赞">
    <loadable-content class="content-wrap keep-scroll-position"
                      :nomore="context.nomore"
                      :loadstate="context.loadstate"
                      :infinite="infinite">
      <ul class="mdl-list">
        <li v-for="item in context.items"
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
        context: {
          id: String,
          items: [],
          nomore: true,
          loadstate: "loading",
          last: 0
        }
      };
    },
    methods: {
      async infinite() {
        await this.getData();
      },
      async getData() {
        let res = await this.$app.api.getLikes(this.$route.query.id, this.context.last);
        let items = res.data;

        if (items.length == 0) {
          this.context.nomore = true;
          return 0;
        }

        await this.$store.dispatch("diary_ensureUsers", items);
        await this.$store.dispatch("diary_updateUserInfo", items);
        this.context.last += items.length;
        this.context.nomore = items.length < this.$app.config.pageSize;

        items.forEach(item => {
          this.context.items.push(item);
        });

        return items.length;
      },
      async load() {
        let id = this.$route.query.id;
        this.context = await this.$store.dispatch("diary_getLikeData", id);
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