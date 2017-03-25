<template>
  <div class="mdl-grid" style="padding-top: 32px">
    <div class="mdl-cell mdl-cell--2-col-tablet mdl-cell--1-col-phone" />
    <div class="mdl-cell mdl-cell--4-col-tablet mdl-cell--2-col-phone">
      <textfield label="帐号" v-model="account" class="full-width" />
      <textfield label="密码" type="password" class="full-width" v-model="password" />
      <button-colored class="full-width mt-32" text="登录" @click.native="submit" />
      <p v-if="errorText" class="mdl-color-text--red mt-32">{{ errorText }}</p>
    </div>
  </div>
</template>

<script>
  import api from "js/api";

  export default {
    data: function () {
      return {
        account: "",
        password: "",
        errorText: ""
      };
    },
    created() {
      this.$store.commit("setTitle", "登录");
    },
    components: {
      "textfield": require("components/ui/textfield.vue"),
      "button-colored": require("components/ui/button-colored.vue"),
    },
    methods: {
      submit() {
        if (this.account && this.password) {
          this.errorText = "";
          this.$store.commit("loading", true);
          api.login(this.account, this.password).then(res => {
            let data = res.data;
            if (data.error) {
              this.errorText = "无效的帐号或密码。";
            } else {
              this.$store.commit("setUserAuth", data.user);
              let user = data.user;
              
              localStorage.authenticated = true;
              localStorage.userid = user.id;
              localStorage.username = user.username;
              localStorage.sessionToken = user.sessionToken;

              let redirect = this.$route.query.redirect;
              this.$router.replace(redirect ? redirect : "/");
            }
            this.$store.commit("loading", false);
          }).catch((err) => {
            console.log(err);
            this.errorText = "网络出错。";
            this.$store.commit("loading", false);
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