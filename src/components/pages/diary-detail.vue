<template>
  <div class="page"
       title="查看日记">
    <div v-if="!error"
         class="page-content">
      <div class="author-section">
        <div class="item-avatar">
          <img :data-src="diary.avatar"
               class="avatar lazyload" />
        </div>
        <div class="item-content">
          <div class="username">{{ diary.username }}</div>
          <div class="text"
               v-html="diary.escapedText"></div>
          <div class="lesson-block">
            <div class="lesson-overview">
              <span>做到下列{{ cards.length }}项功课，获得了</span>
              <span class="exp">{{ diary.expectedExp }}成长值</span>
            </div>
            <div class="lesson-list"
                 :class="{ 'lesson-list-accordion': lessonAccordion }">
              <div class="lesson"
                   v-for="card in cards">
                <img class="card-icon"
                     :src="'../img/card-' + card.id + '.png'">
                <div class="card-name">{{ card.name }}</div>
              </div>
            </div>
            <div class="lesson-show-all"
                 @click="handleShowAllLessons"
                 v-show="showAllLessons">{{ lessonAccordion ? "全部" : "收起" }}</div>
          </div>
          <div class="stat-block">
            <div>{{ diary.time }}</div>
            <div class="mdl-layout-spacer" />
            <div class="counts">
              <i class="material-icons md-16">favorite_border</i>
              <span style="margin-right: 24px">{{ diary.likeCount }}</span>
              <i class="material-icons md-16">comment</i>
              <span>{{ diary.commentCount }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="comment-section">
        <div class="comment-block"
             v-for="comment in comments">
          <div class="item-avatar">
            <img :data-src="comment.avatar"
                 class="avatar lazyload" />
          </div>
          <div class="item-content">
            <div class="username">{{ comment.username }}</div>
            <div class="replied">{{ comment.replied }}</div>
            <div class="text"
                 v-html="comment.escapedText"></div>
            <div class="comment-time">{{ comment.time }}</div>
          </div>
        </div>
        <infinite-scroll v-if="!nomore"
                         :onInfinite="infinite">
          <div slot="no-more">没有更多内容了</div>
        </infinite-scroll>
      </div>
    </div>
    <div v-if="error"
         class="unload">
      (加载错误)
    </div>
  </div>
</template>

<script>
  import api from "api";
  import _ from "lodash";
  // const dialog = require("js/utils/dialog");

  const pageSize = 10;

  export default {
    data() {
      return {
        diary: {},
        comments: [],
        cards: [],
        lessonAccordion: true,
        showAllLessons: false,
        nomore: true,
        last: 0,
        error: false
      };
    },
    methods: {
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
        await this.$store.dispatch("obtainUsers", users);
        await this.$store.dispatch("updateComments", comments);
      },
      async infinite(infiniteScroll) {
        try {
          let res = await api.getMoreDiaryComments(this.diary._id, this.last);
          console.log(res.data);
          let comments = [];
          await this.handleComments(res.data, comments);
          comments.forEach(comment => {
            this.comments.push(comment);
          });

          this.$nextTick(() => {
            this.nomore = comments.length < pageSize;
            this.last += comments.length;

            if (this.nomore) {
              infiniteScroll.$emit("$InfiniteScroll:complete");
            } else {
              infiniteScroll.$emit("$InfiniteScroll:loaded");
            }
          });
        } catch (error) {
          infiniteScroll.$emit("$InfiniteScroll:complete");
        }
      }
    },
    components: {
      "infinite-scroll": require("ui/infinite-scroll.vue"),
    },
    computed: {
      users() {
        return this.$store.getters.getDiaryUsers;
      }
    },
    async mounted() {
      let diaryId = this.$route.query.id;

      try {
        let users = [];
        let comments = [];
        let res = await api.getDiary(diaryId);
        let diary = res.data;
        this.cards = await this.$store.dispatch("lesson_getCards", diary.checkedCards);

        users.push({
          userid: diary.userid
        });

        res = await api.getDiaryComments(diaryId);
        await this.handleComments(res.data, comments, users);
        await this.$store.dispatch("updateDiaries", [diary]);
        this.$set(this.$data, "diary", diary);
        this.$set(this.$data, "comments", comments);

        this.$nextTick(() => {
          lazySizes.loader.unveil(document.querySelector(".avatar"));
          let el = document.querySelector(".lesson-list");
          this.showAllLessons = el.scrollHeight > el.clientHeight;
          this.nomore = comments.length >= diary.commentCount;
          this.last = pageSize;
        });

        // console.log(this.diary);
      } catch (error) {
        console.log(error);
        this.error = true;
      }
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
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

  .unload {
    @include flex-row;
    @include flex-center;
    height: 256px;
    color: $color-hint-text;
  }

  .author-section {
    @include flex-row;
  }

  .comment-block {
    @include flex-row;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid $color-divider;
  }

  .item-avatar {
    background: white;
    width: 40px;
    height: 40px;
    border: 1px solid $color-divider;
    border-radius: 50%;
  }

  .item-avatar img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
  }

  .item-content {
    margin-left: 16px;
    font-size: 16px;
    width: 100%;
  }

  .text {
    color: $color-text;
    margin-top: 8px;
  }

  .username {
    color: $color-blue;
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

  .lazyload,
  .lazyloading {
    opacity: 0;
  }

  .lazyloaded {
    opacity: 1;
    transition: opacity 300ms;
  }

  .lesson-show-all {
    font-size: 14px;
    color: $color-blue;
    margin-top: 8px;
  }

  .comment-time,
  .replied {
    color: $color-hint-text;
    font-size: 12px;
    margin-top: 8px;
  }
</style>