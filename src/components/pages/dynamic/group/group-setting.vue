<template>
  <div class="page" title="群主设置">
    <div class="setting-item">
      <span class="setting-name">群消息提醒</span>
      <!--       <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect md-36" for="switch-1">
          <input type="checkbox" id="switch-1" class="mdl-switch__input" checked>
      </label> -->
      <label class="msg-lable"  for="getTip" @click.stop.prevent="getTipToggle">
        <input name="getTip" type="radio" id="getTip" v-model="isGetTip" />
        <i class="material-icons" :class="{'check': isGetTip }">{{isGetTip ? 'check_circle':'radio_button_unchecked'}}</i>
      </label>
    </div>
    <div class="setting-item">
      <span class="setting-name">举报该群</span>
      <!-- <i class="icon icon-right"></i> -->
      <i class="material-icons md-36 navigate_next">navigate_next</i>
    </div>
    <div class="setting-item">
      <span class="setting-name">清空群消息</span>
      <!-- <i class="icon icon-right"></i> -->
      <i class="material-icons md-36 navigate_next">navigate_next</i>
    </div>
    <button class="mdl-button mdl-js-button share-cancel">取消</button>
  </div>
</template>
<script>
  export default {
    data(){
      return{
        isGetTip: true
      }
    },
    methods:{
      getTipToggle(){
        this.isGetTip = !this.isGetTip
      }
    },
    components: {

    },
    computed: {}
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .page {
    @extend .full-page;
    box-sizing: border-box;
    padding: 15px;
  }
  
  .setting-item {
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    min-height: 55px;
    padding: 0 15px;
    border-radius: 4px;
    .mdl-switch {
      width: 50px;
    }
  }
  
  .mdl-js-button {
    width: 100%;
    height: 44px;
    border-radius: 4px;
    background: $color-red;
    color: #fff;
  }

  .material-icons {
    color: #a5a5a5;
    &.check {
      color: #00aaee;
    }
  }
  .msg-lable{
    height: 24px;
    input {
      visibility: hidden;
    }
  }
</style>