<template>
  <div class="page full-page" title="创建组(1/3)">
    <div class="create-avater">
      <div class="avater-box">
        <img :src="avatar" class="lazyload" width="36" height="36" />
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
  import api from "api";
  const defaultImg = '/img/create-group.png';

  export default {
    data() {
        return {
          avatar: defaultImg
        }
      },
      activated() {
        // 监听 下一步 事件
        let that = this;
        this.$app.toolbars.create([{
          text: "下一步",
          click() {
            if (that.avatar === defaultImg) {
              that.$promp("请选择图片");
              return;
            }
            that.$router.push({
              path: '/dynamic/group-create-two'
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
                that.saveInfo({
                  avatar: url
                });
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