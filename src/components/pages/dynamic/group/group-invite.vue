<template>
  <div class="page" title="邀请好友">
    <label class="invite-list">
	    <div class="invite-item">
	      <img src="/img/default-avatar.png" class="lazyload" width="48" height="48" />
	      <span class="invite-content">爱一个人默默的哭 </span>
	      <!-- <span class="manage-follow" @click="followIt">订阅</span> -->
	      <input type="checkbox">
	      <i class="material-icons">{{checked?'radio_button_unchecked':'check_circle'}}</i>
	    </div>
	</label>
  </div>
</template>
<script>
  export default {
    data() {
    	return{
    		checked:true
    	}
    	
    },
    computed: {}
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
.invite-item {
    @include flex-row;
    @include flex-vertical-center;
    padding: 5px 15px;
    border-bottom: 1px solid $color-divider;
    .invite-content {
      flex: 1;
      @include flex-column;
      padding-left: 15px;
    }
    input{
    	visibility: hidden;
    }
  }
</style>