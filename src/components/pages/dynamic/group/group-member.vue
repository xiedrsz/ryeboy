<template>
  <div class="page" title="组员" actions='[{"text":"排序","clickHandler":"ranking"}]'>
    <div class="page-main">
    	<ul class="member-list">
    		<li class="member-item">
	    		<img src="/img/default-avatar.png" class="lazyload" width="48" height="48"/>    		
	    		<div class="member-info">
	    			<div class="member-info-top">
	    				<span class="member-name">花生LV23</span><span class="member-score">40分</span>
	    			</div>
	    			<div class="member-info-bottom">
	    				<span class="member-code">编号：05</span>
	    				<span class="member-addgroup-time">入组：2017-02-11</span>
	    			</div>
	    		</div>
	    		<span class="member-delete">清退</span>
    		</li>
    	</ul>
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
.member-item{
	@include flex-row;
	@include flex-vertical-center;
	padding: 5px 15px;
	border-bottom: 1px solid $color-divider;
	.member-info{
		flex:1;
		@include flex-column;
		span{
			padding-left: 15px;
		}
	}
	.member-delete{
		@include btn-self;
	}
}
</style>