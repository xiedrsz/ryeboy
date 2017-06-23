<template>
  <li class="item-container"
      @click="$router.push('/pages/diary-detail?id=' + id)">
    <div class="item-date">
      <div class="date">{{ date }}</div>
      <div class="week">{{ week }}</div>
    </div>
    <div class="item-content">
      <div class="text"
           v-html="text"></div>
      <div class="picture-block"
           v-if="pictures.length > 0">
        <div v-for="picture in pictures">
          <img :data-src="picture"
               class="picture lazyload">
        </div>
      </div>
      <div class="comment">
        <div>{{ time }}</div>
        <div class="mdl-layout-spacer" />
        <div class="counts">
          <i class="material-icons md-16">favorite_border</i>
          <span style="margin-right: 24px">{{ likeCount }}</span>
          <i class="material-icons md-16">comment</i>
          <span>{{ commentCount }}</span>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
  export default {
    props: {
      id: String,
      username: String,
      avatar: String,
      text: String,
      pictures: Array,
      time: String,
      date: String,
      week: String,
      verified: Boolean,
      likeCount: {
        type: Number,
        default: 0
      },
      commentCount: {
        type: Number,
        default: 0
      }
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .item-container {
    @include flex-row;
    margin-bottom: 16px;
  }

  .item-date {
    width: 80px;
    color: $color-secondary-text;
  }

  .date {
    font-size: 12px;
  }

  .item-content {
    margin-left: 0px;
    font-size: 16px;
    width: 100%;
  }

  .text {
    color: $color-text;
    line-height: 20px;
    position: relative;
    overflow: hidden;
    max-height: 60px;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    display: -webkit-box;
  }

  .comment {
    @include flex-row;
    margin-top: 8px;
    font-size: 12px;
    color: $color-hint-text;
  }

  .right {
    text-align: right;
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

  .username {
    @include flex-row;
    @include flex-vertical-center;
  }

  .v {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }

  .picture {
    width: 48px;
    height: 48px;
    object-fit: cover;
    margin-right: 2px;
    margin-bottom: 2px;
  }

  .picture-block {
    @include flex-row;
    @include flex-wrap;
    margin: 12px 0 8px 0;
  }
</style>