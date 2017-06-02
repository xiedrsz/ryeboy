<template>
  <div class="page full-page" title="创建组(3/3)">
    <div class="create-avater">
      <div class="avater-box">
        <img src="/img/create-group.png" class="lazyload" width="36" height="36" />
        <span class="add-msg">添加运动团封面</span>
      </div>
      <p class="good-avater">谁不喜欢好看的头像</p>
    </div>

    <div class="img-selecte-list">
      <div class="img-selecte-item">
        <img src="/img/create-group.png" class="lazyload" width="36" height="24" />
        <span class="img-selecte-way">从手机相册选择</span>
        <i class="icon icon-right"></i>
      </div>
      <div class="img-selecte-item">
        <img src="/img/create-group.png" class="lazyload" width="36" height="24" />
        <span class="img-selecte-way">从手机相册选择</span>
        <i class="icon icon-right"></i>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    components: {

    },
    computed: {
      groupInfoTmp() {
        return this.$store.state.group.groupInfoTmp;
      }
    },
    methods: {
      // 保存 小组信息
      saveInfo() {
        this.$store.commit("group_saveTmp", {});
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