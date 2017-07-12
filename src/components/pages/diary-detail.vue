<template>
  <div class="page"
       title="查看日记">
    <loadable-content id="content"
                      class="keep-scroll-position"
                      :nomore="diary.nomore"
                      :loadstate="loadstate"
                      :infinite="infinite">
      <div class="content-block">
        <div class="author-section">
          <div class="diary-avatar">
            <img :data-src="diary.avatar"
                 @click.stop="$router.push('/pages/user-detail?id=' + diary.userid)"
                 class="avatar lazyload">
          </div>
          <div class="diary-main">
            <div class="diary-username">
              <span>{{ diary.username }}</span>
              <span class="diary-userlv">{{ diary.userlv }}</span>
            </div>
            <div class="diary-picture-container"
                 v-if="diary.pictures && diary.pictures.length > 0">
              <div v-for="(picture, index) in diary.pictures"
                   :key="index">
                <img :data-src="picture"
                     @click="openPicture(index)"
                     class="diary-picture lazyload">
              </div>
            </div>
            <div class="diary-text"
                 v-html="diary.escapedText"></div>
            <div class="lesson-block"
                 v-if="diary.cards">
              <div class="lesson-overview">
                <span>做到下列{{ diary.cards.length }}项功课，获得了</span>
                <span class="exp">{{ diary.expectedExp }}成长值</span>
              </div>
              <div class="lesson-list"
                   :class="{ 'lesson-list-accordion': lessonAccordion }">
                <div class="lesson"
                     v-for="card in diary.cards"
                     :key="card.id">
                  <img class="card-icon"
                       :src="require('img/card-' + card.id + '.png')">
                  <div class="card-name">{{ card.name }}</div>
                </div>
              </div>
              <div class="lesson-show-all"
                   @click="handleShowAllLessons"
                   v-show="showAllLessons">{{ lessonAccordion ? "全部" : "收起" }}</div>
            </div>
            <div class="diary-footer">
              <div>{{ diary.time }}</div>
              <div class="mdl-layout-spacer"></div>
              <div class="diary-counts">
                <i class="material-icons md-16"
                   @click="setLike"
                   :class="{ 'diary-like': diary.like }">{{ diary.like ? "favorite" : "favorite_border" }}</i>
                <span style="margin-right: 24px">{{ diary.likeCount }}</span>
                <i class="material-icons md-16">comment</i>
                <span>{{ diary.commentCount }}</span>
              </div>
            </div>
            <div class="diary-likes"
                 @click="$router.push('/pages/diary-like-list?id=' + diary._id)"
                 v-if="diary.likes && diary.likes.length > 0">
              <i class="material-icons md-16">favorite</i>
              <div v-for="(like, index) in diary.likes"
                   :key="index">
                {{ like.username }}{{ index == diary.likes.length - 1 ? "" : "、" }}
              </div>
              <div v-if="diary.likeCount > 3">等{{ diary.likeCount }}人赞过</div>
            </div>
          </div>
        </div>
        <div class="comment-section">
          <div class="comment-container"
               v-for="comment in diary.comments"
               @click="openCommentActions(comment)"
               :key="comment.createdAt">
            <div class="comment-avatar">
              <img :data-src="comment.avatar"
                   @click.stop="$router.push('/pages/user-detail?id=' + comment.userid)"
                   class="avatar lazyload">
            </div>
            <div class="comment-main">
              <div class="comment-username">
                <img v-if="comment.verified"
                     :src="require('img/v.png')"
                     class="comment-v">
                <span>{{ comment.username }}</span>
                <span class="comment-userlv">{{ comment.userlv }}</span>
              </div>
              <div class="comment-replied">{{ comment.replied }}</div>
              <div class="comment-text"
                   v-html="comment.escapedText"></div>
              <div class="comment-time">{{ comment.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </loadable-content>
    <div class="input-section"
         v-show="loadstate == 'loaded'">
      <textarea :placeholder="reply? '回复' + selectedComment.username + ':' : '添加评论:'"
                rows="1"
                class="input-box"
                v-model="comment"></textarea>
      <button-icon icon="send"
                   class="send"
                   @click.native="sendComment"></button-icon>
    </div>
  </div>
</template>

<script>
  import api from "api";
  import _ from "lodash";
  import autosize from "autosize";

  export default {
    data() {
      return {
        diary: {},
        comment: "",
        selectedComment: null,
        reply: null,
        lessonAccordion: true,
        showAllLessons: false,
        loadstate: "loading"
      };
    },
    methods: {
      getUsername() {
        return this.$app.textHelper.getUserName(this.$app.user);
      },
      openPicture(index) {
        let list = [];
        this.diary.pictures.forEach(item => {
          list.push({
            src: item,
            w: 0,
            h: 0,
            doGetSlideDimensions: true
          });
        });
        this.$root.$refs.gallery.open(index, list);
      },
      async setLike() {
        let user = this.$app.user;
        let res = await this.$app.api.setLike(this.diary._id, user._id);

        this.diary.like = res.data.like;

        if (res.data.like) {
          this.diary.likes.unshift({
            userid: user._id,
            username: this.getUsername(),
            createdAt: res.data.createdAt
          });
          this.diary.likeCount++;
        } else {
          let index = this.diary.likes.findIndex(item => {
            return item.userid == user._id;
          });
          if (index >= 0) {
            this.diary.likes.splice(index, 1);
          }
          this.diary.likeCount--;
        }
      },
      copyComment() {},
      replyComment() {
        this.reply = this.selectedComment.userid;
        this.comment = "";
        this.$el.querySelector(".input-box").focus();
      },
      openCommentActions(comment) {
        this.selectedComment = comment;
        this.$app.actionSheet.show([
          {
            text: "复制",
            click: this.copyComment.bind(this),
          }, {
            text: "回复评论",
            click: this.replyComment.bind(this)
          }
        ], this);
      },
      async sendComment() {
        if (!this.authenticated) {
          this.$app.dialog.text("你还没有登录。");
          return;
        }
        if (this.comment) {
          let userid = this.$store.state.user._id;
          let comment = {
            userid,
            content: this.comment,
          };
          if (this.reply) {
            comment.reply = this.reply;
          }
          let comments = [comment];

          try {
            let res = await api.addDiaryComment(this.diary._id, comment);
            comment.createdAt = res.data.createdAt;
            await this.$store.dispatch("diary_ensureUsers", comments);
            await this.$store.dispatch("diary_updateComments", comments);
            this.diary.comments.unshift(comments[0]);

            this.comment = "";

            // 滚动到新的评论
            this.$nextTick(() => {
              document.querySelector("#content").scrollTop = document.querySelector(".comment-section").offsetTop;
            });

          } catch (error) {
            this.$app.dialog.text("提交评论未成功。");
          }
        }
      },
      handleShowAllLessons() {
        this.lessonAccordion = !this.lessonAccordion;
      },
      async handleComments(data, comments, users) {
        if (!users) {
          users = [];
        }

        data.forEach(item => {
          comments.push(item);
          users.push({
            userid: item.userid
          });
          if (item.reply) {
            users.push({
              userid: item.reply
            });
          }
        });
        users = _.uniqBy(users, "userid");
        await this.$store.dispatch("diary_ensureUsers", users);
        await this.$store.dispatch("diary_updateComments", comments);
      },
      async infinite() {
        let res = await api.getMoreDiaryComments(this.diary._id, this.diary.last);
        let comments = [];
        await this.handleComments(res.data, comments);
        comments.forEach(comment => {
          this.diary.comments.push(comment);
        });
        this.diary.last += comments.length;
        this.diary.nomore = comments.length < this.$app.config.pageSize;
      },
      adjustHeight() {
        this.$app.adjustScrollableElement("#content", [".input-section"]);
      },
      async load() {
        let diaryId = this.$route.query.id;
        if (this.diary && this.diary._id == diaryId) {
          return;
        }

        this.loadstate = "loading";
        let diary = await this.$store.dispatch("diary_getDataById", diaryId);

        if (diary && diary.comments) {
          this.diary = diary;
        } else {
          try {
            let users = [];
            let comments = [];
            let res = await api.getDiary(diaryId, this.userid);
            let diary = res.data;

            diary.cards = await this.$store.dispatch("lesson_getCards", diary.checkedCards);

            users.push({
              userid: diary.userid
            });

            diary.likes.forEach(item => {
              users.push({
                userid: item.userid
              });
            });

            if (diary.like) {
              let index = diary.likes.findIndex(item => {
                return item.userid == this.userid;
              });
              if (index == -1) {
                users.push({
                  userid: this.userid
                });
              } else {
                diary.likes.splice(index, 1);
              }
              diary.likes.unshift({
                userid: this.userid
              });
            }

            res = await api.getDiaryComments(diaryId);
            await this.handleComments(res.data, comments, users);
            await this.$store.dispatch("diary_updateData", [diary]);

            diary.likes.forEach(item => {
              let user = this.users[item.userid];
              item.username = this.$app.textHelper.getUserName(user);
            });
            diary.comments = comments;
            diary.nomore = comments.length >= diary.commentCount;
            diary.last = this.$app.config.pageSize;
            this.diary = (await this.$store.dispatch("diary_addMap", [diary]))[0];
          } catch (error) {
            console.log(error);
            this.loadstate = "error";
          }
        }

        this.loadstate = "loaded";
        this.$nextTick(() => {
          try {
            let el = document.querySelector(".lesson-list");
            this.showAllLessons = el.scrollHeight > el.clientHeight;
            this.adjustHeight();

            this.inputElement = document.querySelector(".input-box");
            autosize(this.inputElement);
            this.inputElement.addEventListener("autosize:resized", this.adjustHeight);
          } catch (error) {
            console.log(error);
          }
        });
      }
    },
    components: {
      "textfield": require("ui/textfield.vue"),
      "button-icon": require("ui/button-icon.vue"),
      "loadable-content": require("ui/loadable-content.vue"),
    },
    computed: {
      authenticated() {
        return this.$store.state.user.authenticated;
      },
      userid() {
        return this.authenticated ? this.$store.state.user._id : null;
      },
      users() {
        return this.$store.getters.diary_users;
      }
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.adjustHeight);

      if (this.inputElement) {
        this.inputElement.removeEventListener("autosize:resized", this.adjustHeight);
      }
    },
    async activated() {
      await this.load();
      this.__restorePosition();
    },
    mounted() {
      window.addEventListener("resize", this.adjustHeight);
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  @import "~scss/diary-item.scss";
  @import "~scss/comment-item.scss";
  .exp {
    color: $color-blue;
  }

  .lesson-block {
    font-size: 14px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid $color-divider;
  }

  .lesson-overview {
    color: $color-secondary-text;
    margin-bottom: 8px;
  }

  .lesson-list {
    @include flex-row;
    @include flex-wrap;
  }

  .lesson-list-accordion {
    max-height: 60px;
    overflow: hidden;
  }

  .lesson {
    width: 120px;
    @include flex-row;
    @include flex-vertical-center;
  }

  .card-name {
    color: $color-secondary-text;
  }

  .card-icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    border: 1px solid $color-disable;
    border-radius: 4px 2px 2px 2px;
    background-color: $color-divider;
  }

  .author-section {
    @include flex-row;
  }

  .comment-section {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid $color-divider;
  }

  .stat-block {
    @include flex-row;
    font-size: 12px;
    color: $color-hint-text;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid $color-divider;
  }

  .counts {
    @include flex-row;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .counts span {
    margin-left: 4px;
  }

  .lesson-show-all {
    font-size: 14px;
    color: $color-blue;
    margin-top: 8px;
  }

  .input-section {
    @include flex-row;
    border-top: 1px solid $color-divider;
    padding: 8px 0;
    background-color: $color-hint-block;
    position: fixed;
    bottom: 0px;
    width: 100%;
  }

  #content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
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

  .picture {
    width: 80px;
    height: 80px;
    object-fit: cover;
    margin-right: 3px;
    margin-bottom: 3px;
  }

  .picture-block {
    @include flex-row;
    @include flex-wrap;
    margin: 12px 0 8px 0;
  }

  .diary-likes {
    @include flex-row;
    @include flex-vertical-center;
    @include flex-wrap;
    font-size: 14px;
    color: $color-secondary-text;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid $color-divider;
  }

  .diary-likes i {
    color: $color-red;
    margin-right: 4px;
  }
</style>