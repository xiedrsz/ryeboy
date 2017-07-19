<template>
  <div>
    <div class="basic"
         v-if="authenticated">
      <img :data-src="avatar"
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
                 @click.native="$router.push('/pages/login')">
      </list-item>
      <list-item text="注册"
                 @click.native="$router.push('/pages/register')">
      </list-item>
    </list>
    <list v-if="authenticated">
      <list-item text="状态"
                 @click.native="$router.push('/pages/status')">
      </list-item>
      <list-item text="日记"
                 @click.native="$router.push('/pages/personal-diary')">
      </list-item>
      <list-item text="消息"
                 @click.native="$router.push('/pages/message')">
      </list-item>
      <list-item text="收藏"
                 @click.native="$router.push('/pages/favorite')">
      </list-item>
    </list>
    <list>
      <list-item text="设置"
                 :divider="false"
                 @click.native="$router.push('/pages/settings')"></list-item>
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
      avatar() {
        let user = this.user;
        if (this.user.portrait) {
          return `${this.$app.config.ossAddress}/portraits/${user._id}_${user.portrait}.jpg`;
        } else {
          return "../../img/default-avatar.png";
        }
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
</style>