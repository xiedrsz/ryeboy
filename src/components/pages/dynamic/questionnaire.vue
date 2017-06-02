<template>
  <div class="page full-page" title="填问卷">
    <div class="question-list">
    	<span class="question-description">您的受教育程度<i class="required">*</i></span>
    	<div class="radio-box">
		<label class="radio-label" :for="`educations_${index}`" v-for="(education, index) in educations">	
	        <input type="radio" v-model="currentValue1" :id="`education_${index}`" :value="education">
	        <span>{{education}}</span>		      
		</label>
		</div>
    </div>

    <div class="question-list">
    	<span class="question-description">您的婚恋情况<i class="required">*</i></span>
    	<div class="radio-box">
    		<label class="radio-label" :for="`marriages_${index}`" v-for="(marriage, index) in marriages">	
    	        <input type="radio" v-model="currentValue2" :id="`marriage_${index}`" :value="marriage">
    	        <span>{{marriage}}</span>		      
    		</label>
    		</div>
    </div>
  </div>
</template>
<script>
  export default {
  	data(){
  		return{
  			educations:["小学","中学","高中","大学","大学以上"],
  			currentValue1: "",
      		marriages:["单身","恋爱中","结婚"],
      		currentValue2:""
  		}
  	},
    components: {
     
    },
    computed: {
    }
  };

</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .question-list{
  	margin: 20px 10px;
	.required{
		color:$color-red;    
	}
 }
 .radio-box{
	border: 1px solid $color-divider;
	background:#fff;
	padding:0 10px;
	.radio-label{
 		@include flex-row;
		@include flex-vertical-center;
		padding:10px 0;
		border-bottom: 1px solid $color-divider;
	}
  }
</style>