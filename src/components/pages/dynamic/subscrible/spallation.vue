<template>
  <div class="page" title="蜕变史" actions='[{"text":"退订","clickHandler":"unsubscrible"}]'>
    <div class="channel-container-wrap">
      <div class="channel-container">
        <div v-for="item in spallationType" @click="switchChannel(item.id)" :id="item.id" :class="{ active: item.id == channelSelected }" class="channel">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="page-main">
      <swipe ref="swipe" @slidechanged="slideChanged">
        <swipe-slide v-for="channel in spallationType" :id="channel.id">
          <div class="slide-content">
            <ul class="mdl-list">
              
              <dynamic-item v-for="item in subChannels[channel.id]" />
              
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
          channelSelected: "essence"
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
      created() {
        //this.getDiary();
      },
      computed: {
        // 蜕变史分类
        spallationType() {
            return this.$store.state.subscrible.spallationType;
          },
          diaries() {
            return this.$store.getters.getGroupNews;
          },
          // 当前月度频道
          reading() {
            return this.$store.state.subscrible.reading;
          },
          // 蜕变史
          subChannels() {
            return this.$store.getters.getSubChannels;
          }
      },
      mounted() {
        // 退订
        this.$on("unsubscrible", () => {
          let id = this.reading.id;
          this.$store.dispatch("unsubscribe", {
            id
          });
          /*this.$promp("确定退出吗", () => {
            console.log('tuiding')
          }, true)*/
        })
      },
      methods: {
        // 侧滑
        slideChanged(index) {
            this.channelSelected = this.spallationType[index].id;
          },
          // 切换频道
          switchChannel(id) {
            this.channelSelected = id;
            let index = _.findIndex(this.spallationType, ["id", id]);
            this.$refs.swipe.slideTo(index);
          },
          // 获取蜕变史列表
          getSubChannels() {
            this.$store.dispatch("getGroupNews", "123");
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
</style>