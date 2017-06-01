<template>
  <div class="page" title="群名片">
    <div class="card-box">
      <h4 class="group-name">每天坚持</h4>
      <span class="group-id">群号：256244</span>
      <img src="/img/default-avatar.png" class="lazyload" width="120" height="120" />
      <span class="scane">扫一扫</span>
      <p class="group-info">方向努力，每天都不一样，相互鼓励</p>
    </div>
    <div class="share-box">
      <button class="mdl-button mdl-js-button share-btn">下载到手机</button>
      <button class="mdl-button mdl-js-button share-btn">分享给好友</button>
    </div>
    <div class="mdl-dialog-container">
      <div class="mdl-dialog">
        <div class="share-way">
          <img src="/img/default-avatar.png" class="lazyload" width="24" height="24" />
          <p class="share-way-name">微信分享</p>
        </div>
        <button class="mdl-button mdl-js-button share-cancel">取消</button>
      </div>
    </div>
  </div>

</template>
<script>
  export default {
    components: {
      "modal-loading": require("ui/modal-loading.vue"),
    },
    computed: {}
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .mdl-dialog-container {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: flex-end;
    .mdl-dialog {
      width: 100%;
      background-color: #cfdade;
      padding-top: 15px;
      .share-way {
        width: 25%;
        text-align: center;
        padding: 0 15px;
        img {
          border-radius: 50%;
        }
      }
      .mdl-js-button {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background-color: #c3c3c3
      }
    }
  }
  
  .page {
    @extend .full-page;
    @include flex-column;
    @include flex-vertical-center;
    @include flex-horizontal-center;
  }
  
  .card-box {
    width: 60%;
    @include flex-column;
    @include flex-vertical-center;
    text-align: center;
    padding: 10px 20px 0;
    background: #fff;
    h4 {
      font-size: 16px;
      line-height: 20px;
    }
    .group-id {
      font-size: 13px;
      color: #777;
      margin-bottom: 8px;
    }
  }
  
  .share-box {
    position: fixed;
    bottom: 0;
    height: 44px;
    width: 100%;
    background: #333;
    @include flex-row;
    @include flex-vertical-center;
    @include flex-horizontal-center(space-around);
    .mdl-js-button {
      width: 40%;
      background: $color-blue;
      color: #fff;
    }
  }
</style>