<template>
  <div class="page"
       title="登录">
    <div class="mdl-grid"
         style="padding-top: 32px">
      <div class="mdl-cell mdl-cell--2-col-tablet mdl-cell--1-col-phone" />
      <div class="mdl-cell mdl-cell--4-col-tablet mdl-cell--2-col-phone">
        <textfield label="帐号"
                   :floating="true"
                   v-model="account"
                   class="full-width" />
        <textfield label="密码"
                   :floating="true"
                   type="password"
                   class="full-width"
                   v-model="password" />
        <button-colored class="full-width mt-32"
                        text="登录"
                        @click.native="submit" />
        <p v-if="errorText"
           class="mdl-color-text--red mt-32">{{ errorText }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import api from "api";
  const dialog = require("js/utils/dialog");

  export default {
    data: function() {
      return {
        account: "",
        password: "",
        errorText: ""
      };
    },
    components: {
      "textfield": require("components/ui/textfield.vue"),
      "button-colored": require("components/ui/button-colored.vue"),
    },
    beforeRouteEnter: (to, from, next) => {
      if (!to.query.redirect) {
        to.query.redirect = from.path;
      }
      next();
    },
    methods: {
      submit() {
        if (this.account && this.password) {
          this.errorText = "";
          dialog.showLoading();
          api.login(this.account, this.password).then(res => {
            let data = res.data;
            if (data.error) {
              this.errorText = "无效的帐号或密码。";
            } else {
              localStorage.authenticated = true;
              this.$store.commit("user_setAuth", data.user);
              let redirect = this.$route.query.redirect;
              this.$store.dispatch("getSubscribedChannels").then(() => {
                setTimeout(() => {
                  dialog.hideLoading();
                  this.$router.replace(redirect ? redirect : "/");
                }, 1000);
              });
            }
          }).catch((err) => {
            console.log(err);
            this.errorText = "网络出错。";
            dialog.hideLoading();
          });
        } else {
          this.errorText = "请填写帐号密码。";
        }
      }
    }
  };
</script>

<style scoped>
  .full-width {
    width: 100%;
  }

  .mt-32 {
    margin-top: 32px;
  }
</style>