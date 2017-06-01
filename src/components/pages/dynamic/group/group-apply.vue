<template>
  <div class="page" title="组群申请">
    <ul class="apply-list">              
      <li class="mdl-list__item mdl-list__item--bottom-divider">
        <img src="/img/default-avatar.png" width="36" height="36" />
        <div class="apply-list-content">
          <span class="apply-name">大海12620155</span>
          <span class="apply-level">申请加入:花生小组</span>
          <span class="apply-info">理由:大海</span>
        </div>
        <span class="mdl-list__item-note">
        	<button class="mdl-button mdl-js-button mdl-button--fab btn-reject">
			  <i class="material-icons">close</i>
			</button>
        	<button class="mdl-button mdl-js-button mdl-button--fab btn-agree">
			  <i class="material-icons">done</i>
			</button>
        </span>
      </li>
      
    </ul>
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

.mdl-list__item {
padding: 8px 16px;
}


.apply-list-content {
    flex: 1;
    @include flex-column;
    @include flex-vertical-center(flex-start);
    font-size: 12px;
    margin-left: 10px;
    line-height: 16px;
  }
.mdl-button--fab{
	    height: 24px;
    min-width: 24px;
    width: 24px;
    box-shadow:none;

    &.btn-reject{
		background:$color-orange;
    }
    &.btn-agree{
		background:$color-green;
    }
    .material-icons{
    	    font-size: 18px;

    color: #fff;
    }
}
</style>