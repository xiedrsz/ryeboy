<template>
  <div class="page" title="麦田计划">
	  <div class="plan-box ci-border-b"> 	
	  	<div class="plan-title">
	    	<span class="plan-name"></span>
	    	<span class="plan-icon">
	    		<i class="material-icons">share</i>
	    		<i class="material-icons">file_download</i>
	    	</span>
	    </div>
	    <p class="plan-one">计划一：用事实唤醒全社会对不良习惯的关注</p>
	    <div class="plan-row">
	    	<div class="plan-col col-offset-20">
	    		<span class="plan-num">1000</span>
	    		<span class="plan-name">调查问卷</span>
	    		<span class="plan-event write-question">
	    			<i class="material-icons">edit</i>
	    			填写调差问卷
	    		</span>
	    	</div>
			<div class="plan-col">
	    		<span class="plan-num">1000</span>
	    		<span class="plan-name">调查问卷</span>
	    		<span class="plan-event write-question" @click="goSpallation">
	    			<i class="material-icons">edit</i>
	    			蜕变史
	    		</span>
	    	</div>
	    </div>
	  </div>
	  <div class="plan-box"> 	
	  	<div class="plan-title">
	    	<span class="plan-name">调查问卷统计报告</span>
	    	<span class="plan-icon">
	    		<i class="material-icons">share</i>
	    		<i class="material-icons">file_download</i>
	    	</span>
	    </div>
	  </div>
  </div>
</template>
<script>
  export default {
    components: {
     
    },
    computed: {
    },
    methods:{
    	goSpallation(){
    		this.$router.push({
    			path:"/dynamic/spallation"
    		})
    	}
    }
  };

</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
.plan-box{
  	padding: 10px 15px;
	.plan-title{
		@include flex-row;
		@include flex-horizontal-center(space-between);
		@include flex-vertical-center;
	}
	.plan-row{
		 @include flex-row;
		.plan-col{
			flex: 1;			
			@include flex-column;
			text-align:center;
			span{
				line-height:32px;
			}
			&.col-offset-20{
				margin-right:20%;
			}
			.plan-num{
				border-bottom: 1px solid $color-divider;
			}    
			.plan-name{
				margin-bottom: 20px;
			}
			.plan-event{
				@include flex-row;
				@include flex-center;
				border:1px solid $color-divider;
				border-radius: 8px;
				background:$bg-light-blue;
			}

		}
	}
}
.ci-border-b{	
	border-bottom: 1px solid $color-divider;
}
.plan-icon{
	
	
}
</style>