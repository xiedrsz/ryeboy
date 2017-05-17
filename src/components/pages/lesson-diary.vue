<template>
  <div class="page"
       title="写日记"
       :actions="actions">
    <div class="page-content">
      <div class="input-hint">记录当天的进步并肯定自己</div>
      <div class="input-container">
        <textarea class="input-box"
                  type="text"
                  rows="8"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    methods: {
      finish() {

      }
    },
    computed: {
      actions() {
        return JSON.stringify([{
          text: "完成",
          clickHandler: "finish"
        }]);
      },
    },
    mounted() {
      this.$on("finish", this.finish);

      document.querySelector("textarea").focus();
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
  }

  .input-container {
    width: 90%;
    margin-top: 16px;
  }

  .input-hint {
    color: $color-secondary-text;
  }
</style>