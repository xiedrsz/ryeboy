<template>
  <div class="page" title="订阅管理">
    <div class="channel-container-wrap">
      <div class="channel-container">
        <div v-for="item in channels" @click="switchChannel(item.id)" :id="item.id" :class="{ active: item.id == channelSelected }" class="channel">
          {{ item.name }}
        </div>
      </div>
    </div>

    <div class="page-main">
      <swipe ref="swipe" @slidechanged="slideChanged">
        <swipe-slide v-for="channel in channels" :id="channel.id">
          <div class="slide-content">
            <ul class="manage-list">
		        <li class="manage-item">
		          <img src="/img/default-avatar.png" class="lazyload" width="48" height="48" />
		          <div class="manage-info">
		            <div class="manage-info-top">
		              <span class="manage-name">症状</span>
		            </div>
		            <div class="manage-info-bottom">
		              <span class="group-fans">5万人关注</span>
		              <span class="group-diaries">10万日记</span>
		            </div>
		          </div>
		          <span class="manage-follow" @click="followIt">订阅</span>
		        </li>
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
          channelSelected: "support"
        };
      },
      components: {
        "spinner": require("ui/spinner.vue"),
        "swipe": require("ui/swipe.vue"),
        "swipe-slide": require("ui/swipe-slide.vue"),
        "pull-to-refresh": require("ui/pull-to-refresh.vue"),
        "infinite-scroll": require("ui/infinite-scroll.vue"),
      },
      created() {
        this.getDiary();
      },
      computed: {
        channels() {
            return this.$store.state.subscrible.channels;
          },
          diaries() {            
            return this.$store.getters.getGroupNews;
          }
      },
      mounted() {
        
      },
      methods: {
        // 侧滑
        slideChanged(index) {
            this.channelSelected = this.channels[index].id;
          },
          // 切换频道
          switchChannel(id) {
            this.channelSelected = id;
            let index = _.findIndex(this.channels, ["id", id]);
            this.$refs.swipe.slideTo(index);
          },
          // 获取日记
          getDiary() {
            this.$store.dispatch("getGroupNews", "123");
          },
          //订阅日记
          followIt(){
          	console.log('订阅')
          }
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
.manage-item {
    @include flex-row;
    @include flex-vertical-center;
    padding: 5px 15px;
    border-bottom: 1px solid $color-divider;
    .manage-info {
      flex: 1;
      @include flex-column;
      span {
        padding-left: 15px;
      }
    }
    .manage-follow {
      @include btn-self;
    }
  }
</style>