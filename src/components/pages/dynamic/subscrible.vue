<template>
  <div class="page" title="我的订阅" actions='[{"text":"添加","clickHandler":"add-subscrible"}]'>
    <ul class="sub-list">
      <li class="sub-item">
        
        <div class="material-icons mdl-badge mdl-badge--overlap" data-badge="1"><img src="/img/default-avatar.png" width="36" height="36" /></div>
        <div class="item-content">
          <span class="sub-name">陈翔6点半</span>
          <span class="sub-info">陈翔6点半陈翔6点半陈翔6点半</span>
        </div>
        <span class="sub-time">2017-6-1</span>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    components: {
     
    },
    computed: {
    	
    }
  };

</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
.sub-item{
  @include flex-row;
  padding: 15px;
}
.item-content{
  flex:1;
}
</style>