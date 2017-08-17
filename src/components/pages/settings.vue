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
                 @click.native="checkVersion"
                 :secondaryText="currentVersion"
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
      checkVersion() {
        try {
          let platform = this.$app.platform || "android";
          let {
            latest,
            latestDescription
          } = window.app.serverVersion.client[platform];
          if (latest > window.app.client) {
            this.$app.dialog.promptHtml(
              "发现新版本：" + latestDescription + "<br><br><div style='color:rgba(0,0,0,.87)'>你确定要更新吗？</div>",
               this.$app.updateClient.bind(this.$app));
          } else {
            this.$app.dialog.text("已经是最新版本。");
          }
        } catch (error) {
          console.log(error);
        }
      },
      logout() {
        this.$app.afterLogout();
        this.$app.reload();
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
      currentVersion() {
        return "当前版本 " + window.app.version;
      },
      authenticated() {
        return this.$store.state.user.authenticated;
      }
    }
  };
</script>