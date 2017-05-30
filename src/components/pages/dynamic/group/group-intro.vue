<template>
  <div class="page" title="群介绍" actions='[{"text":"保存","clickHandler":"save-group-msg"}]'>
    <div class="page-main">
		<textarea rows="8"></textarea>
    </div>
  </div>
</template>
<script>
  export default {
    components: {

    },
    methods: {
    	save(){
    		this.$store.dispatch("saveGroupMsg");
    	}
    },
    mounted(){
     	this.$on("save-group-msg",() =>{
     		this.save()
     	})
    }
  };
</script>

<style lang="scss" scoped>
@import "~scss/main.scss";
	.mdl-layout__content{
		
	}
	.page-main{
		padding: 10px 15px;
    box-sizing: border-box;
	}
	textarea{
		width: 100%;
		padding:5px;
	    border: 1px solid $color-divider;
	    background:$color-light-blue;
	}
</style>