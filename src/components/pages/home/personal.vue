<template>
  <div>
    <div class="basic"
         @click="$router.push('/pages/personal-info')"
         v-if="authenticated">
      <img :data-src="user.avatar"
           class="avatar lazyload">
      <div class="info">
        <div class="username">
          <img v-if="verified"
               :src="'../../img/v.png'"
               class="v">
          </img>
          <span>{{ username }}</span>
          <span class="userlv">{{ userlv }}</span>
        </div>
      </div>
    </div>
    <list v-if="!authenticated">
      <list-item text="登录"
                 :showRightArrow="true"
                 @click.native="$app.login('/')">
      </list-item>
      <list-item text="注册"
                 route="/pages/register">
      </list-item>
    </list>
    <list v-if="authenticated">
      <list-item text="状态"
                 route="/pages/status">
      </list-item>
      <list-item text="日记"
                 route="/pages/personal-diary">
      </list-item>
      <list-item text="消息"
                 route="/pages/message">
        <span slot="secondary"
              v-show="messageCount"
              class="badge">{{ messageCount }}</span>
      </list-item>
      <list-item text="收藏"
                 route="/pages/favorite">
      </list-item>
    </list>
    <list>
      <list-item text="设置"
                 route="/pages/settings"
                 :divider="false"></list-item>
    </list>
  </div>
</template>

<script>
  export default {
    components: {
      "list": require("ui/list.vue"),
      "list-item": require("ui/list-item.vue")
    },
    computed: {
      authenticated() {
        return this.$store.state.user.authenticated;
      },
      user() {
        return this.$store.state.user;
      },
      username() {
        return this.$app.textHelper.getUserName(this.user);
      },
      verified() {
        return this.user.level == "70";
      },
      userlv() {
        return this.$app.textHelper.getUserLevel(this.user);
      },
      messageCount() {
        if (!this.$store.state.user.messageCount) {
          return 0;
        }
        let {
          comment,
          system
        } = this.$store.state.user.messageCount;
        let r = comment + system;
        return r > 99 ? "..." : r;
      }
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .basic {
    @include flex-row;
    padding: 32px 32px 16px 32px;
    background-color: $color-hint-block;
  }

  .avatar {
    width: 64px;
    height: 64px;
    object-fit: cover;
  }

  .info {
    margin-left: 16px;
  }

  .username {
    @include flex-row;
    @include flex-vertical-center;
    font-size: 16px;
  }

  .userlv {
    font-size: 12px;
    margin-left: 8px;
    color: $color-hint-text;
  }

  .v {
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }

  .badge {
    font-size: 12px;
    font-family: Arial, Helvetica, sans-serif;
    background: $color-red;
    padding: 3px;
    color: #fff;
    background: $color-red;
    border-radius: 2px;
    min-width: 12px;
    text-align: center;
  }
</style>