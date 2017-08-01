<template>
  <div class="page"
       title="分享应用">
    <div class="page-content">
      <div class="actions">
        <div class="action"
             @click="shareToWechat">
          <img :src="require('img/wechat.png')">分享到微信</div>
        <div class="action"
             @click="shareToQQ">
          <img :src="require('img/qq.png')">分享到QQ</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      shareToWechat() {
        Wechat.share({
          message: {
            title: "最科学系统的戒撸app:麦田男孩,重回健康阳光生活,上万麦友期待你的参与!",
            description: "",
            thumb: "https://ryeboy-app-apk-1.oss-cn-qingdao.aliyuncs.com/ios/57.png",
            media: {
              type: Wechat.Type.WEBPAGE,
              webpageUrl: "http://a.app.qq.com/o/simple.jsp?pkgname=org.ryeboy.app.android"
            }
          },
          scene: Wechat.Scene.TIMELINE // share to Timeline
        }, () => {
          this.$app.toast("分享成功。");
        }, failReason => {
          console.log(failReason);
        });
      },
      shareToQQ() {
        let args = {};
        args.url = "http://a.app.qq.com/o/simple.jsp?pkgname=org.ryeboy.app.android";
        args.title = "最科学系统的戒撸app";
        args.description = "麦田男孩:边打怪升级,边重回健康阳光生活,上万麦友期待你的参与!";
        args.imageUrl = "https://ryeboy-app-apk-1.oss-cn-qingdao.aliyuncs.com/ios/57.png";
        args.appName = "麦田男孩";
        YCQQ.shareToQQ(() => {
          this.$app.toast("分享成功。");
        }, failReason => {
          console.log(failReason);
        }, args);
      }
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .actions {
    @include flex-row;
    @include flex-center;
    font-size: 12px;
    margin-top: 32px;
    margin-left: 32px;
    margin-right: 32px;
    padding-top: 16px;
    padding-bottom: 16px;
  }

  .actions img {
    width: 48px;
    height: 48px;
  }

  .action {
    @include flex-column;
    @include flex-vertical-center;
    margin-right: 16px;
    margin-left: 16px;
  }
</style>