<template>
  <div class="page" title="我的订阅" actions='[{"text":"添加","clickHandler":"add-subscrible"}]'>
    <ul class="sub-list">
      <li class="sub-item" @click="goChannels" v-for="subscrible in getSubscrible">        
        <div class="material-icons mdl-badge mdl-badge--overlap" :data-badge="msgNum|msgNum">
          <img :src="subscrible.avatar" width="36" height="36" /></div>
        <div class="item-content">
          <span class="sub-name">{{subscrible.name}}</span>
          <span class="sub-info">{{subscrible.descrption}}</span>
        </div>
        <span class="sub-time">{{subscrible.time|time}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    components: {
     
    },
    computed: {
      getSubscrible() {
        console.log(this.$store.state.subscrible.subscribles)
        return this.$store.state.subscrible.subscribles;
      }
    },
    activated() {
      // 获取 关注概述
      this.$store.dispatch("getSubscribles");
    },
    data(){
        return{
          nowtime:'2017-6-3',
          msgNum: 120
        }
    },
    methods:{
      goChannels(){
        this.msgNum = ""
        this.$router.push({
          path: '/dynamic/spallation'
        })
      }
    }
  };

</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
.sub-item{
  @include flex-row;
  padding: 15px;
  .item-content{
    flex:1;
    margin-left:5px;
    span{
      display: block;
      line-height:20px;
      &.sub-info{
        font-size:12px;
      }
    }
  }
  .sub-time{
      font-size:12px;
  }
  .mdl-badge:after{
    color:#fff;
    background:$color-red;
  }
}
</style>