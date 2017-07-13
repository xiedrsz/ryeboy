<template>
  <li class="item-container"
      @click="$router.push('/pages/diary-detail?id=' + id)">
    <div class="diary-avatar">
      <img :data-src="avatar"
           @click.stop="$router.push('/pages/user-detail?id=' + userid)"
           class="lazyload">
    </div>
    <div class="diary-main">
      <div class="diary-username">
        <img v-if="verified"
             :src="require('img/v.png')"
             class="diary-v">
        <span>{{ username }}</span>
        <span class="diary-userlv">{{ userlv }}</span>
      </div>
      <div class="diary-text"
           v-html="text"></div>
      <div class="diary-picture-container"
           v-if="pictures && pictures.length > 0">
        <div v-for="picture in pictures"
             :key="picture">
          <img :data-src="picture"
               class="diary-picture lazyload">
        </div>
      </div>
      <div class="diary-footer">
        <div>{{ time }}</div>
        <div class="mdl-layout-spacer"></div>
        <div class="diary-counts">
          <i class="material-icons md-16"
             :class="{ 'diary-like': like }">{{ like ? "favorite" : "favorite_border" }}</i>
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
      userid: String,
      username: String,
      avatar: String,
      text: String,
      pictures: Array,
      time: String,
      verified: Boolean,
      like: Boolean,
      likeCount: {
        type: Number,
        default: 0
      },
      commentCount: {
        type: Number,
        default: 0
      },
      userlv: [String, Number]
    },
    methods: {
      showUserDetail() {
        console.log("showUserDetail");
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

  .right {
    text-align: right;
  }

  .diary-text {
    color: $color-secondary-text;
    margin-top: 8px;
    line-height: 20px;
    position: relative;
    overflow: hidden;
    max-height: 60px;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    display: -webkit-box;
  }
</style>