<template>
  <div class="page" title="创建组(2/3)" actions='[{"text":"下一步","clickHandler":"create-next"}]'>
    <div class="group-info-list">
        <div class="group-info-item">
            <div class="info-item-title">
                <span>起个好名字，让团更有吸引力</span>
                <span>12个</span>
            </div>
            <input type="text" class="info-item" placeholder="12个字以内"/>
        </div>        
    </div>
    <div class="group-info-list">
        <div class="group-info-item">
            <div class="info-item-title">
                <span>团简介</span>
                <span>40个</span>
            </div>
            <textarea rows="3" placeholder="40个以内"/>
        </div>        
    </div>
  </div>
</template>
<script>
  export default {
    components: {

    },
    computed: {}
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";



  .info-item-title {
  	@include flex-row;
    @include flex-horizontal-center(space-between);
    background:#dcdcdc;
    height: 44px;
    line-height:44px;
    padding:0 15px;
  }
  input,textarea{
    width: 100%;
    border: 0;
    padding: 10px 15px;
    font-size: 14px;
  }
  input{
    height: 20px;
    line-height: 20px;
  }
</style>