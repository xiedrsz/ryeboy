<template>
  <div class="mdl-dialog-container"
       v-show="show">
    <div class="mdl-dialog">
      <div class="mdl-dialog__content">
        <p>
          登录使用完整的功能。
        </p>
        <div class="actions">
          <div class="action">
            <img :src="require('img/wechat.png')">微信登录</div>
          <div class="action">
            <img :src="require('img/qq.png')">QQ登录</div>
          <div class="action" @click="loginUseAccount">
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
  export default {
    data() {
      return {
        show: false
      };
    },
    methods: {
      loginUseAccount(){
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