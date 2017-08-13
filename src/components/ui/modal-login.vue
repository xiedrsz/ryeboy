<template>
  <div class="mdl-dialog-container"
       v-show="show">
    <div class="mdl-dialog">
      <div class="mdl-dialog__content">
        <p>
          登录使用完整的功能。
        </p>
        <div class="actions">
          <div class="action"
               @click="wechatLogin">
            <img :src="require('img/wechat.png')">微信登录</div>
          <div class="action"
               @click="qqLogin">
            <img :src="require('img/qq.png')">QQ登录</div>
          <div class="action"
               @click="accountLogin">
            <i class="material-icons md-32">account_circle</i>帐号登录</div>
        </div>
      </div>
      <div class="mdl-dialog__actions">
        <button type="button"
                class="mdl-button cancel"
                @click="close">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
  function qq_checkClientInstalled() {
    return new Promise(resolve => {
      var args = {};
      args.client = QQSDK.ClientType.QQ;
      QQSDK.checkClientInstalled(() => {
        resolve(true);
      }, () => {
        resolve(false);
      }, args);
    });
  }

  function qq_ssoLogin() {
    return new Promise((resolve, reject) => {
      var args = {};
      args.client = QQSDK.ClientType.QQ;
      QQSDK.ssoLogin(result => {
        resolve(result);
      }, function(failReason) {
        reject(failReason);
      }, args);
    });
  }

  function wechat_checkClientInstalled() {
    return new Promise(resolve => {
      Wechat.isInstalled(installed => {
        resolve(installed);
      }, () => {
        resolve(false);
      });
    });
  }

  function wechat_ssoLogin() {
    return new Promise((resolve, reject) => {
      var scope = "snsapi_userinfo",
        state = "_" + (+new Date());
      Wechat.auth(scope, state, response => {
        resolve(response);
      }, function(reason) {
        reject(reason);
      });
    });
  }

  export default {
    data() {
      return {
        show: false
      };
    },
    methods: {
      async relatedLogin({
        account,
        password
      }) {
        let res = await this.$app.api.login(account, password);
        let data = res.data;

        if (data.error) {
          throw "data.error";
        } else {
          await this.$app.afterLogin(data);
          this.$router.replace("/home/personal");
          // this.$router.push(this.$store.state.page.loginRedirect);
        }
      },
      async wechatLogin() {
        this.close();
        if (!this.$app.deviceready) return;

        try {
          let clientInstalled = await wechat_checkClientInstalled();
          if (clientInstalled) {
            let res = await wechat_ssoLogin();
            let {
              access_token,
              openid
            } = (await this.$app.api.getWechatAccessToken(res.code)).data;
            if (!openid) {
              throw "invalid openid";
            }
            let userid = openid;
            let {
              nickname
            } = (await this.$app.api.getWechatUserInfo(access_token, openid)).data;
            res = await this.$app.api.ssoLogin(userid, "wechat", nickname);
            await this.relatedLogin(res.data);
          } else {
            this.$app.toast("你还没有安装微信");
          }
        } catch (error) {
          this.$app.toast("登录失败");
        }
      },
      async qqLogin() {
        this.close();
        if (!this.$app.deviceready) return;

        try {
          let clientInstalled = await qq_checkClientInstalled();
          if (clientInstalled) {
            let res = await qq_ssoLogin();
            res = await this.$app.api.ssoLogin(res.userid, "qq");
            await this.relatedLogin(res.data);
          } else {
            this.$app.toast("你还没有安装QQ");
          }
        } catch (error) {
          this.$app.toast("登录失败");
        }
      },
      accountLogin() {
        this.close();
        this.$router.push("/pages/login");
      },
      open() {
        this.show = true;
        this.$store.commit("page_setPopup", this.photoswipe);
      },
      close() {
        this.show = false;
        this.$store.commit("page_setPopup");
      },
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .mdl-dialog-container {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.3);
  }

  .mdl-dialog-container .mdl-dialog {
    background-color: white;
    padding: 8px;
  }

  .mdl-dialog__title {
    font-size: 2.0rem
  }

  .actions {
    @include flex-row;
    font-size: 12px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid $color-divider;
    padding-bottom: 16px;
    border-bottom: 1px solid $color-divider;
  }

  .actions img {
    width: 32px;
    height: 32px;
  }

  .action {
    @include flex-column;
    @include flex-vertical-center;
    margin-right: 16px;
  }
</style>