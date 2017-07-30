<template>
  <div class="page full-page" title="修改小组头像">
    <div class="create-avater">
      <div class="avater-box">
        <img :src="avatar||(apiAddress+groupInfo.avatar)" class="lazyload" width="36" height="36" />
        <span class="add-msg">添加运动团封面</span>
      </div>
      <p class="good-avater">谁不喜欢好看的头像</p>
    </div>

    <div class="img-selecte-list">
      <input style="display: none" ref="album" type="file" accept="image/*" @change="getPicture">
      <input style="display: none" ref="camera" type="file" accept="image/*" capture="camera" @change="getPicture">
      <div class="img-selecte-item" @click="album">
        <img src="/img/create-group.png" class="lazyload" width="36" height="24" />
        <span class="img-selecte-way">从相册选一张</span>
        <i class="icon icon-right"></i>
      </div>
      <div class="img-selecte-item" @click="camera">
        <img src="/img/create-group.png" class="lazyload" width="36" height="24" />
        <span class="img-selecte-way">拍一张照片</span>
        <i class="icon icon-right"></i>
      </div>
    </div>
  </div>
</template>
<script>
  let urlTmp = '';
  import config from "js/config";

  export default {
    computed: {
      groupInfo() {
        return this.$store.state.group.groupInfo;
      }
    },
    data() {
      return {
        avatar: "",
        apiAddress: config.apiAddress
      }
    },
    activated() {
      // 监听 保存 事件
      let that = this;
      this.$app.toolbars.create([{
        text: "保存",
        click() {
          if (!urlTmp) {
            that.$promp("请选择图片");
            return;
          }
          that.$store.dispatch("saveGroupInfo", {
            groupInfo: {
              avatar: urlTmp
            },
            callback(url) {
              that.$router.push({
                path: '/dynamic/group-info'
              });
            }
          });
        }
      }]);
    },
    methods: {
      // 保存 小组信息
      saveInfo(group) {
          this.$store.commit("group_saveTmp", group);
        },
        camera() {
          this.$refs.camera.click()
        },
        album() {
          this.$refs.album.click()
        },
        getPicture(event) {
          let that = this;
          let file = event.target.files[0];
          let reader = new FileReader();
          reader.onload = function(e) {
            that.avatar = e.target.result
          }
          reader.readAsDataURL(file);
          this.$store.dispatch("uploadImage", {
            file,
            callback(url) {
              urlTmp = url;
            }
          });
        }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .create-avater {
    background: #fff;
    width: 100%;
    height: 60%;
    margin-bottom: 15px;
    @include flex-column;
    @include flex-center;
    .avater-box {
      padding: 35px 30px;
      text-align: center;
      border: 1px dotted #a5a5a5;
    }
    .add-msg {
      font-size: 16px;
      color: #a5a5a5;
      margin-top: 20px;
      display: block;
    }
    .good-avater {
      font-size: 17px;
      color: #333;
      line-height: 40px;
      margin: 0;
    }
  }
  
  .img-selecte-item {
    @include flex-row;
    @include flex-vertical-center;
    background: #fff;
    padding: 5px 0;
    border-bottom: 1px solid $color-divider;
    img {
      margin: 0 12px;
    }
    .img-selecte-way {
      flex: 1;
    }
  }
</style>