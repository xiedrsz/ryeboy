<template>
  <div>
    <loadable-content class="content-wrap keep-scroll-position"
                      :nomore="nomore"
                      :loadstate="loadstate"
                      :infinite="infinite">
      <ul class="mdl-list">
        <li class="comment-container"
            v-for="(item, index) in items"
            :key="item._id"
            @click="openActions(item)">
          <div class="comment-avatar">
            <img :data-src="item.avatar"
                 class="avatar lazyload">
          </div>
          <div class="comment-main">
            <div class="comment-username">
              <img v-if="item.verified"
                   :src="require('img/v.png')"
                   class="comment-v">
              <span>{{ item.username }}</span>
              <span class="comment-userlv">{{ item.userlv }}</span>
            </div>
            <div class="comment-text"
                 v-html="item.escapedText"></div>
            <div class="comment-time">
              {{ item.time }}
            </div>
          </div>
        </li>
      </ul>
    </loadable-content>
    <div class="reply-container"
         v-show="enableReply">
      <textarea :placeholder="reply? '回复' + selectedItem.username + ':' : '添加评论:'"
                rows="1"
                class="input-box"
                v-model="comment"></textarea>
      <button-icon icon="send"
                   class="send"
                   @click.native="send"></button-icon>
    </div>
  </div>
</template>

<script>
  import _ from "lodash";

  export default {
    data() {
      return {
        items: [],
        selectedItem: {},
        loadstate: "loading",
        nomore: true,
        enableReply: false,
        comment: "",
        last: new Date()
      };
    },
    watch: {
      enableReply() {
        this.$nextTick(() => {
          this.adjustHeight();
        });
      }
    },
    methods: {
      adjustHeight() {
        this.$app.adjustScrollableElement(".content-wrap", [".tabs", ".reply-container"]);
      },
      async send() {
        if (this.comment) {
          let comment = {
            userid: this.userid,
            content: this.comment,
            reply: this.selectedItem.userid
          };

          try {
            await this.$app.api.addDiaryComment(this.selectedItem.info.id, comment);

            this.enableReply = false;
            this.comment = "";

            this.$app.toast("回复成功。");
          } catch (error) {
            this.$app.dialog.text("回复失败，可能是网络不给力。");
          }
        }
      },
      copy() {
        this.$app.copyToClipboard(this.selectedItem.content);
      },
      reply() {
        this.enableReply = true;
        this.$nextTick(() => {
          document.querySelector(".input-box").focus();
        });
      },
      showDiary() {
        this.$router.push(`/pages/diary-detail?id=${this.selectedItem.info.id}`);
      },
      openActions(item) {
        this.selectedItem = item;
        this.$app.actionSheet.show([
          {
            text: "复制",
            click: this.copy.bind(this)
          }, {
            text: "回复评论",
            click: this.reply.bind(this)
          }, {
            text: "查看日记",
            click: this.showDiary.bind(this)
          }
        ], this);
      },
      async getData(userid, last) {
        let res = await this.$app.api.getNotices(userid, "comment", last);
        let items = res.data;

        if (items.length == 0) {
          this.nomore = true;
          return 0;
        }

        items.forEach(item => item.userid = item.sender);
        await this.$store.dispatch("diary_ensureUsers", items);
        await this.$store.dispatch("diary_updateComments", items);
        items.forEach(item => this.items.push(item));

        this.nomore = items.length < this.$app.config.pageSize.normal;
        this.last = _.last(items).createdAt;

        return items.length;
      },
      async infinite() {
        await this.getData(this.userid, this.last);
      }
    },
    computed: {
      userid() {
        return this.$store.state.user._id;
      },
      newContentCount() {
        let {
          messageCount
        } = this.$store.state.user;
        if (messageCount) {
          return messageCount.comment;
        } else {
          return 0;
        }
      }
    },
    components: {
      "button-icon": require("ui/button-icon.vue"),
    },
    async activated() {
      this.$nextTick(() => {
        this.$app.restorePosition(this.$el);
      });
    },
    async mounted() {
      this.adjustHeight();

      try {
        let count = await this.getData(this.userid);
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
  @import "~scss/comment-item.scss";
  .reply-container {
    @include flex-row;
    border-top: 1px solid $color-divider;
    padding: 8px 0;
    background-color: $color-hint-block;
    position: fixed;
    bottom: 0px;
    width: 100%;
  }

  .input-box {
    margin-left: 16px;
    margin-right: 8px;
    flex-grow: 1;
    outline: none;
    resize: none;
    border: 0;
    border-bottom: 1px solid $color-disable;
    background-color: transparent;
    max-height: 72px;
    color: $color-text;
  }

  .send {
    margin-right: 16px;
    color: $color-secondary-text;
  }
</style>