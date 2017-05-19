<template>
  	<div>
		<div v-if="noLoading" class="unload">
		    (未加载)
		</div>
		<div v-else-if="loadingErro" class="loadstate" @click="erroReloader">
		    (加载错误,可点击重新加载)
		</div>
		<div v-else-if="noContent" class="loadstate">
		    (无内容)
		</div>
		<div v-else-if="showLoadingIcon" class="loadstate">
		    <spinner />
		</div>
  	</div>
</template>

<script>
export default {
	props:{
		noLoading:{
			type:Boolean,
			default: false
		},
		loadingErro:{
			type:Boolean,
			default: false
		},
		noContent:{
			type:Boolean,
			default: false
		},
		showLoadingIcon:{
			type:Boolean,
			default: false
		},
	},
	components:{
		"spinner": require("ui/spinner.vue")
	},
	methods: {
		erroReloader(){
			console.log("换一批")			
			this.$emit('dateReloader') 
		}
	}
};
</script>

<style lang="scss" scoped>
@import "~scss/main.scss";
	.loadstate {
	    @include flex-row;
	    @include flex-center;
	    height: 128px;
	}
	  
	.unload {
	    @include flex-row;
	    @include flex-center;
	    height: 256px;
	    color: $color-hint-text;
	}
</style>