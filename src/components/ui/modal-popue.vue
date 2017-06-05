<template>
    <div class="popue-box" v-model="popue.show">
    	<transition name="vux-mask">
    		<div class="popue_mask" v-show="popue.show"></div>
    	</transition>
    	<transition name="vux-dialog">
	    	<div class="popue_dialog" v-show="popue.show">
	    		<h3 class="popue-title">提示</h3>
	    		<div class="popue-content">{{popue.msg}}</div>
	    		<div class="popue-footer">
			        <button class="defaul_btn ok_btn" @click="closePromp">确定</button>
			        <button v-show="popue.cancel" class="defaul_btn cancle_btn" @click="popue.show=false">取消</button>
			    </div>
	    	</div>
    	</transition>
    </div>
</template>
<script>
export default{
	props: {
	    value: {
	        type: Boolean,
	        default: false
      	},
	    maskTransition: {
	      type: String,
	      default: 'vux-fade'
	    },
	    dialogTransition: {
	      type: String,
	      default: 'vux-dialog'
	    }
	},
    created () {
	    if (typeof this.value !== 'undefined') {
	      this.currentValue = this.value
	    }
	},
	watch: {
	    value (val) {
	      this.currentValue = val
	    },
	    currentValue (val) {
	      this.$emit(val ? 'on-show' : 'on-hide')
	    }
	},
	data () {
	    return {
	      currentValue: false
	    }
	},
    methods: {
		closePromp() {
            this.popue.show = false
            let callback = this.popue.callback;
	        !!callback && callback()
        }
  	},
	computed: {
	    popue() {
	      return this.$store.state.page.popue;
	    }
	}
}
</script>
<style lang="scss" scoped>
@import "~scss/main.scss";
h3{
	margin:0;
}
.popue_mask{
	position: fixed;
    z-index: 1000;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
}
.popue_dialog{
	position: fixed;
    z-index: 5000;
    width: 85%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #FAFAFC;
    text-align: center;
    overflow: hidden;
	color: #333;
    border-radius: 8px;
	h3.popue-title{
		padding: 26px 15px 15px;
	    line-height: 1;
	    font-weight: 400;
	    text-align: center;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    font-size: 16px;
	}
	.popue-content{
		    padding: 0 13px 26px;
		    font-size: 16px;
	    line-height: 20px;
	}
	.popue-footer{
	    position: relative;
	    border: 0;
	    height: 44px;
	    line-height: 44px;
	    text-align: center;
	    color: #00aaee;
	    display: flex;
	    border-top: 1px solid #e5e5e5;
	    button{
			font-family: inherit;
		    font-style: inherit;
		    font-weight: inherit;
		    outline: 0;
		    border: 0;
		    background: none;
		    overflow: visible;
		    text-transform: none;
		    cursor: pointer;
		    height: 100%;
		    width: 100%;
		    color: #00aaee;
		    font-size: 16px;
	    }
	}
}
</style>