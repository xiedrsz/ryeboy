<template>
  <div class="page" title="小组勋章">
    <div class="page-main">
      <div class="info-medal-title">勋章由组员的蜕变史点亮</div>
      <div class="info-medal-grid">
        <div class="grids-30" v-for="num in medalNum">
          <img src="/img/default-avatar.png" class="lazyload" width="36" height="36" />
          <span class="medal-num">{{num}}</span>
        </div>
      </div>
      <div class="medal-sorting-box">
        <div class="sorting-title">
          <span>组员蜕变史：8个</span>
          <span>排序</span>
        </div>
        <div class="sorting-item">
          <span class="sorting-level">1</span>
          <img src="/img/default-avatar.png" class="lazyload" width="36" height="36" />
          <span class="sorting-name">苹果</span>
          <span class="sorting-tiem">2017-2-30</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  /**
   * 可能缺少的接口
   * [1] 蜕变史列表
   * [2] 勋章列表
   */
  export default {
    data() {
        return {
          medalNum: ['0/3', '3/15', '15/30', '30/50', '50/100', '100/300']
        }
      },
      components: {

      },
      computed: {}
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .page-main {
    padding: 0 15px;
  }
  
  .info-medal-title {
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    height: 36px;
    line-height: 36px;
  }
  
  .info-medal-grid {
    display: flex;
    flex-wrap: wrap;
    padding: 10px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    .grids-30 {
      flex: 0 0 33.33%;
      width: 33.33%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
  
  .sorting-title {
    display: flex;
    height: 36px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  }
  
  .sorting-item {
    display: flex;
    align-items: center;
    padding: 5px 0;
  }
  
  .sorting-level {
    flex: 0 0 10%;
    width: 10%;
  }
  
  .sorting-name {
    flex: 0 0 30%;
    width: 30%;
    text-align: center;
  }
  
  .sorting-tiem {
    flex: 1;
    text-align: right;
  }
</style>