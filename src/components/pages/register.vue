<template>
  <div class="page"
       title="注册">
    <div class="mdl-grid"
         style="padding-top: 16px">
      <div class="mdl-cell mdl-cell--2-col-tablet mdl-cell--1-col-phone"></div>
      <div class="mdl-cell mdl-cell--4-col-tablet mdl-cell--2-col-phone">
        <textfield label="帐号"
                   :floating="true"
                   v-model="account"
                   class="full-width">
        </textfield>
        <div class="note">2-16个字符，可以是汉字、数字、字母、下划线</div>
        <textfield label="密码"
                   :floating="true"
                   type="password"
                   style="margin-top: 16px"
                   class="full-width"
                   v-model="password">
        </textfield>
        <div class="note">6-16个任意字符</div>
        <button-colored class="full-width mt-32"
                        text="注册"
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

          if (/学长/.test(this.account)) {
            this.errorText = "帐号不能包含“学长”";
            return;
          }
          if (/麦田/.test(this.account)) {
            this.errorText = "帐号不能包含“麦田”";
            return;
          }

          if (/^[0-9a-zA-Z\u4e00-\u9fa5_]{2,16}$/.test(this.account) == false) {
            this.errorText = "帐号填写不正确";
            return;
          }

          if (/^.{6,16}$/.test(this.password) == false) {
            this.errorText = "密码填写不正确";
            return;
          }

          try {
            this.$el.focus();
            let res = await this.$app.api.register(this.account, this.password);
            console.log(res);
            let data = res.data;

            if (data.error) {
              this.errorText = data.error;
            } else {
              await this.$app.afterLogin(data);
              this.$router.replace("/");
            }
          } catch (err) {
            this.$app.dialog.text("注册失败。");
            console.log(err);
          }
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

  .note {
    font-size: 12px;
    color: rgba(0, 0, 0, .38);
    margin-top: -14px;
  }
</style>