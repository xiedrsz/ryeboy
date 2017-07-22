<template>
  <div class="page">
    <div class="page-content">

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
    methods: {
      async submit() {

      }
    },
    deactivated() {
      this.$store.commit("page_setSpacer");
    },
    activated() {
      this.$store.commit("page_setSpacer", "searchbox");
      this.$app.toolbars.create([{
        text: "搜索",
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