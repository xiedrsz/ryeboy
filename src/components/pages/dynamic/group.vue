<template>
	<div class="page" title="花生小组" actions='[{"text":"小组资料","clickHandler":"/dynamic/group-info"}]'>

		<div class="channel-container-wrap">
	      <div class="channel-container">
	        <div v-for="item in channels"
	        	@click="switchChannel"
	             :id="item.id"
	             :class="{ active: item.active }"
	             class="channel">
	          {{ item.name }}
	        </div>
	      </div>
	    </div>
		<div class="page-main">
	      	<swipe ref="swipe" @slidechanged="slideChanged">
		        <swipe-slide v-for="channel in channels" :id="channel.id">
		          	<div class="slide-content">
		          		<ul class="mdl-list">
			              <dynamic-item v-for="(item, index) in dynamic" :likeCount="item.likeCount" :commentCount="item.commentCount" :avatar="item.avatar" :username="item.username" :text="item.escapedText" :time="item.time" :overflow="item.overflow" :likeIt="item.likeIt" :index="index"/>
                        </ul>	            
			        </div>
		        </swipe-slide>
	      	</swipe>
	    </div>
	</div> 
</template>
<script>
import _ from "lodash";
import store from "store";
  export default {
    data() {    	
      return {
        slideContentHeight: '500px',
        enableInfiniteScroll: false,
        dynamic:[{
        	likeCount: 6,
        	commentCount: 8,
        	avatar:'/img/default-avatar.png',
        	username: '果冻',
        	escapedText: '果冻果冻果冻果冻',
        	time: '5-20',
        	overflow: false,
        	likeIt: false,
        	index: 0

        }]
      };
    },
    components: {
      "dynamic-item": require("components/pages/dynamic/concern/dynamic-item.vue"),
      "spinner": require("ui/spinner.vue"),
      "swipe": require("ui/swipe.vue"),
      "swipe-slide": require("ui/swipe-slide.vue"),
      "pull-to-refresh": require("ui/pull-to-refresh.vue"),
      "infinite-scroll": require("ui/infinite-scroll.vue"),
    },
    deactivated() {
      this.enableInfiniteScroll = false;
    },
    activated() {
      this.enableInfiniteScroll = true;
    },
    computed: {
    	channels(){    		
    		if(this.$store.state.group.channels.length)
    			return this.$store.state.group.channels;
    		this.aa()
    		this.slideChanged(0);
    		return this.$store.state.group.channels;
    	}
    },
    mounted() {    	
    	// 监听 添加 事件
      this.$on("/dynamic/group-info", () => {
        this.$router.push({
          path: '/dynamic/group-info'
        })
      })
    },
    methods:{
	      aa(){
	        store.commit("group_setDefaultChannels");
	      },
	      slideChanged(index) {
	        let channel = this.channels[index];
	        let label = channel.id;
	        this.$store.commit("group_switchChannel", label);
	        console.log(this.channels)
	      },
	      switchChannel(event) {
	        let label = event.target.id;
	        let index = _.findIndex(this.channels, ["id", label]);
	        this.$refs.swipe.slideTo(index);
	      },
    }
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .page-layout {
    @include flex-column;
    width: 100%;
  }

  .channel-container-wrap {
    height: 36px;
    min-height: 36px;
    @include flex-row;
    border-bottom: 1px solid $color-divider;
    background-color: $color-hint-block;
  }

  .channel-container {
    margin: 0;
    width: 100%;
    padding-left: 8px;
    padding-right: 8px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .slide-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .channel {
    color: $color-secondary-text;
    text-decoration: none;
    display: table-cell;
    white-space: nowrap;
    padding-left: 8px;
    padding-right: 8px;
    text-align: left;
    line-height: 36px;
  }

  .channel.active {
    color: $color-blue;
  }

  .channel-filter-container {
    position: relative;
    display: table;
    margin: 0;
    padding-left: 8px;
    padding-right: 8px;
  }

  .channel-filter {
    color: $color-hint-text;
    text-decoration: none;
    display: table-cell;
    white-space: nowrap;
    padding-left: 8px;
    padding-right: 8px;
    text-align: left;
    line-height: 36px;
  }

  .channel-filter.active {
    color: $color-text;
  }

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

  .mdl-list {
    padding: 0;
    margin: 8px 16px;
  }

  .mdl-list li {
    margin-bottom: 32px;
  }
</style>