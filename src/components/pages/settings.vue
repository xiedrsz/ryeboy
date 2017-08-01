<template>
  <div class="page"
       title="设置">
    <list>
      <!-- <list-item text="修改密码"
                 @click.native="$router.push('/pages/change-password')"
                 v-if="authenticated"></list-item>
      <list-item text="应用锁"></list-item> -->
      <list-item text="分享应用"
                 route="/pages/share"></list-item>
      <list-item text="清除本地缓存"
                 @click.native="clearLocalStorage"></list-item>
      <list-item text="意见反馈"
                 route="/pages/feedback"></list-item>
      <list-item text="检查版本"
                 :divider="false"></list-item>
    </list>
    <div v-if="authenticated"
         style="margin-top: 64px; text-align: center">
      <button-flat text="退出登录"
                   :border="true"
                   @click.native="logout"></button-flat>
    </div>
  </div>
</template>

<script>
  export default {
    components: {
      "button-flat": require("components/ui/button-flat.vue"),
      "list": require("components/ui/list.vue"),
      "list-item": require("components/ui/list-item.vue")
    },
    methods: {
      logout() {
        this.$app.afterLogout();
        this.$router.replace("/");
      },
      internal_clearLocalStorage() {
        localStorage.clear();
        this.$app.toast("清除成功。");
      },
      clearLocalStorage() {
        if (this.authenticated) {
          this.$app.dialog.prompt("清除本地缓存同时会退出登录，你确定清除吗？", () => {
            this.internal_clearLocalStorage();
            this.logout();
          });
        } else {
          this.internal_clearLocalStorage();
        }
      }
    },
    computed: {
      authenticated() {
        return this.$store.state.user.authenticated;
      }
    }
  };
</script>