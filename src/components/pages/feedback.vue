<template>
  <div class="page"
       title="意见反馈">
    <div class="page-content">
      <div class="input-container">
        <div class="label">亲爱的麦友，请写下你对麦田的建议^_^~</div>
        <textarea class="input-box"
                  v-model="content"
                  type="text"
                  rows="8"></textarea>
        <div class="label">你的邮箱（选填）</div>
        <textfield type="text"
                   :floating="true"
                   v-model="email"></textfield>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        content: "",
        email: ""
      };
    },
    components: {
      "textfield": require("components/ui/textfield.vue")
    },
    methods: {
      async submit() {
        if (!this.content) {
          this.$app.dialog.text("还没有写内容呢。");
          return;
        }
        this.$el.focus();
        let userid = this.$store.state.user.authenticated ? this.$store.state.user._id : "";
        await this.$app.api.feedback(this.content, this.email, userid);
        this.$app.toast("提交成功。");
        this.content = "";
        this.email = "";
        history.go(-1);
      }
    },
    activated() {
      this.$app.toolbars.create([{
        text: "提交",
        click: this.submit
      }]);
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .input-box {
    width: 100%;
    outline: none;
    resize: none;
    border: 1px solid #efefef;
    padding: 8px;
    color: $color-text;
    margin-top: 8px;
    margin-bottom: 32px;
  }

  .input-container {
    width: 90%;
    margin-top: 16px;
  }

  .label {
    font-size: 14px;
    color: $color-hint-text;
  }
</style>