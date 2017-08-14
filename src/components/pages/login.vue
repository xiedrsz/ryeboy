<template>
  <div class="page"
       title="登录">
    <div class="mdl-grid"
         style="padding-top: 32px">
      <div class="mdl-cell mdl-cell--2-col-tablet mdl-cell--1-col-phone"></div>
      <div class="mdl-cell mdl-cell--4-col-tablet mdl-cell--2-col-phone">
        <textfield label="帐号"
                   :floating="true"
                   v-model="account"
                   class="full-width">
        </textfield>
        <textfield label="密码"
                   :floating="true"
                   type="password"
                   class="full-width"
                   v-model="password">
        </textfield>
        <button-colored class="full-width mt-32"
                        text="登录"
                        @click.native="submit">
        </button-colored>

        <p v-if="errorText"
           class="mdl-color-text--red mt-32">{{ errorText }}</p>
      </div>
    </div>

  </div>
</template>

<script>
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
    methods: {
      async submit() {
        if (this.account && this.password) {
          this.errorText = "";

          try {
            this.$el.focus();
            let res = await this.$app.api.login(this.account, this.password);
            let data = res.data;

            if (data.error) {
              this.errorText = data.error;
            } else {
              await this.$app.afterLogin(data);
              this.$router.replace("/home/personal");
              // this.$router.replace(this.$store.state.page.loginRedirect);
            }
          } catch (err) {
            this.$app.dialog.text("帐号或密码不正确。");
            console.log(err);
          }
        } else {
          this.errorText = "请填写帐号密码。";
        }
      }
    },
    mounted() {
      let router = this.$router;
      this.$app.toolbars.create([{
        text: "注册",
        click() {
          router.replace("/pages/register");
        }
      }]);
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