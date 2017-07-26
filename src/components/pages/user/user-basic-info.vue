<template>
  <div class="info-container">
    <div class="avatar-wrap">
      <img :data-src="user.avatar"
           v-if="user.avatar"
           class="avatar lazyload">
    </div>
    <div class="info">
      <div class="username">
        <img v-if="user.verified"
             :src="require('img/v.png')"
             class="v">
        <span>{{ user.username }}</span>
        <span class="userlv">{{ user.userlv }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      user: Object
    },
    watch: {
      "user.avatar": function() {
        let el = this.$el.querySelector(".avatar");
        if (el) {
          lazySizes.loader.unveil(el);
        }
      }
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .info-container {
    @include flex-row;
    padding: 16px;
    box-sizing: border-box;
  }

  .avatar-wrap {
    background: white;
    width: 40px;
    height: 40px;
    border: 1px solid $color-divider;
    border-radius: 50%;
  }

  .avatar {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
  }

  .info {
    margin-left: 16px;
    font-size: 16px;
    width: 100%;
  }

  .username {
    color: $color-blue;
    @include flex-row;
    @include flex-vertical-center;
  }

  .username span {
    margin-right: 8px;
  }

  .v {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }

  .userlv {
    font-size: 12px;
    color: $color-hint-text;
  }
</style>