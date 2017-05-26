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
    </div>
    <div v-if="error"
         class="unload">
      (加载错误)
    </div>
  </div>
</template>

<script>
  import api from "api";
  // const dialog = require("js/utils/dialog");

  export default {
    data() {
      return {
        diary: {},
        comments: [],
        cards: [],
        lessonAccordion: true,
        showAllLessons: false,
        error: false
      };
    },
    methods: {
      handleShowAllLessons() {
        this.lessonAccordion = !this.lessonAccordion;
      }
    },
    components: {

    },
    computed: {
      users() {
        return this.$store.getters.getDiaryUsers;
      }
    },
    async mounted() {
      let diaryId = this.$route.query.id;

      try {
        let res = await api.getDiary(diaryId);
        let diary = res.data;
        this.cards = await this.$store.dispatch("lesson_getCards", diary.checkedCards);
        await this.$store.dispatch("obtainUsers", [diary]);
        await this.$store.dispatch("updateDiaries", [diary]);

        this.$set(this.$data, "diary", diary);

        res = await api.getDiaryComments(diaryId);
        res.data.forEach(item => {
          this.comments.push(item);
        });
        await this.$store.dispatch("obtainUsers", res.data);

        this.$nextTick(() => {
          lazySizes.loader.unveil(document.querySelector(".avatar"));
          let el = document.querySelector(".lesson-list");
          this.showAllLessons = el.scrollHeight > el.clientHeight;
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
    background-color: $color-disable;
    margin-right: 4px;
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
</style>