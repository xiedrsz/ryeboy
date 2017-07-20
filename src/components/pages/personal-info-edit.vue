<template>
  <div class="page"
       :title="$route.query.title">
    <div class="page-content">
      <div class="label">{{ label }}</div>
      <textfield type="text"
                 v-model="content">
      </textfield>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        label: "",
        content: ""
      };
    },
    methods: {
      async finish() {
        if (this.content) {
          if (this.content == this.originContent) {
            history.go(-1);
            return;
          }

          let name = this.$route.query.name;

          switch (name) {
            case "phone":
              if (this.content.length < 11) {
                this.$app.dialog.text("手机号码不正确。");
                return;
              }
              break;
            case "email":
              if (!/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/.test(this.content)) {
                this.$app.dialog.text("邮箱格式不正确。");
                return;
              }
              break;
            case "nickname":
              if (/学长/.test(this.content)) {
                this.$app.dialog.text("昵称不能包含“学长”。");
                return;
              }
              if (/麦田/.test(this.content)) {
                this.$app.dialog.text("昵称不能包含“麦田”。");
                return;
              }

              if (/^[0-9a-zA-Z\u4e00-\u9fa5_]{2,16}$/.test(this.content) == false) {
                this.$app.dialog.text("昵称格式不正确。");
                return;
              }

              break;
          }

          try {
            let r = await this.$app.api.upateUserInfo(this.$app.userid, name, this.content);
            let error = r.data.error;
            if (error) {
              if (error == "duplicate") {
                this.$app.dialog.text("已经有人使用了。");
              }
              return;
            }
            this.$store.commit("user_updateInfo", {
              name,
              content: this.content
            });

            history.go(-1);
          } catch (error) {
            this.$app.dialog.text("无法完成操作。");
          }
        } else {
          this.$app.dialog.text("内容不能为空。");
        }
      }
    },
    computed: {
      user() {
        return this.$store.state.user;
      }
    },
    components: {
      "textfield": require("components/ui/textfield.vue"),
    },
    activated() {
      this.$app.toolbars.create([{
        text: "完成",
        click: this.finish
      }]);

      let name = this.$route.query.name;
      switch (name) {
        case "phone":
          this.label = "请填写正确的手机号码：";
          this.content = this.user.phone;
          break;
        case "email":
          this.label = "请填写正确的邮箱：";
          this.content = this.user.email;
          break;
        case "nickname":
          this.label = "2-16个字符，可以是汉字、数字、字母、下划线：";
          this.content = this.user.nickname;
          break;
      }

      this.originContent = this.content;
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .page-content {
    padding: 32px;
  }

  .label {
    color: $color-secondary-text;
  }
</style>