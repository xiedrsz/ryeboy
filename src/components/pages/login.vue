<template>
  <div class="page" title="登录">
    <div class="mdl-grid" style="padding-top: 32px">
      <div class="mdl-cell mdl-cell--2-col-tablet mdl-cell--1-col-phone" />
      <div class="mdl-cell mdl-cell--4-col-tablet mdl-cell--2-col-phone">
        <textfield label="帐号" v-model="account" class="full-width" />
        <textfield label="密码" type="password" class="full-width" v-model="password" />
        <button-colored class="full-width mt-32" text="登录" @click.native="submit" />
        <p v-if="errorText" class="mdl-color-text--red mt-32">{{ errorText }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from "api";
import * as types from "store/mutation-types";

export default {
  data: function () {
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
        this.$store.commit(types.SHOW_LOADING, true);
        api.login(this.account, this.password).then(res => {
          let data = res.data;
          if (data.error) {
            this.errorText = "无效的帐号或密码。";
          } else {
            this.$store.commit(types.SET_USER_AUTH, data.user);
            let user = data.user;

            localStorage.authenticated = true;
            localStorage.userid = user.id;
            localStorage.username = user.username;
            localStorage.sessionToken = user.sessionToken;

            let redirect = this.$route.query.redirect;

            this.$store.dispatch("getSubscribedChannels").then(() => {
              this.$router.replace(redirect ? redirect : "/");
            });
          }
          this.$store.commit(types.SHOW_LOADING, false);
        }).catch((err) => {
          console.log(err);
          this.errorText = "网络出错。";
          this.$store.commit(types.SHOW_LOADING, false);
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