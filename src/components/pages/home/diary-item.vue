<template>
  <li class="item-container">
    <div class="item-avatar">
      <img :data-src="avatar"
           class="lazyload" />
    </div>
    <div class="item-content">
      <div>{{ username }}</div>
      <div class="text"
           v-html="text">{{ text }}</div>
      <div class="comment">
        <div>{{ time }}</div>
        <div class="mdl-layout-spacer" />
        <div class="counts">
          <i class="material-icons md-16">favorite_border</i><span style="margin-right: 24px">{{ likeCount }}</span><i class="material-icons md-16">comment</i><span>{{ commentCount }}</span>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    username: String,
    avatar: String,
    text: String,
    time: String,
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

<style lang="scss" scoped>
@import "~scss/main.scss";
.item-container {
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

.lazyload,
.lazyloading {
  opacity: 0;
}

.lazyloaded {
  opacity: 1;
  transition: opacity 300ms;
}
</style>