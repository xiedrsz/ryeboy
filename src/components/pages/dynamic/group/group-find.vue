<template>
  <div class="page" title="小组列表" icons='[{"text":"search","clickHandler":"group-search"},{"text":"add","clickHandler":"group-create"}]'>

    <div class="channel-container-wrap">
      <div class="channel-container">
        <div v-for="item in groupClass" @click="switchChannel(item.id)" :id="item.id" :class="{ active: item.id == classSelected }" class="channel">
          {{ item.name }}
        </div>
      </div>
    </div>

    <div class="page-main">
      <swipe ref="swipe" @slidechanged="slideChanged">
        <swipe-slide v-for="channel in groupClass" :id="channel.id">
          <div class="slide-content">
            <ul class="find-list">
              
              <li class="mdl-list__item mdl-list__item--bottom-divider" v-for="(item, index) in groups[channel.id]">
                <img src="/img/default-avatar.png" width="36" height="36" />
                <div class="find-list-content">
                  <span class="group-name">花生小组</span>
                  <span class="group-level"> 1/30
                    <i class="material-icons md-12 star-gray">star</i>
                  </span>
                  <span class="group-info">小组描述:都是中学生,一起加油</span>
                </div>
                <span class="mdl-list__item-note">加入</span>
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
          classSelected: "all"
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
        this.getGroupList()
      },
      computed: {
        groupClass() {
            return this.$store.state.group.groupClass;
          },
          groups() {
            return this.$store.getters.getGroupList;
          }
      },
      mounted() {
        // 监听 添加 事件
        this.$on("/dynamic/group-info", () => {
          this.$router.push({
            path: '/dynamic/group-info'
          })
        })
        this.$on("group-create", () => {
          this.$router.push({
            path: '/dynamic/group-create'
          })
        })
      },
      methods: {
        // 侧滑
        slideChanged(index) {
            this.classSelected = this.listchannels[index].id;
          },
          // 切换频道
          switchChannel(id) {
            this.classSelected = id;
            let index = _.findIndex(this.listchannels, ["id", id]);
            this.$refs.swipe.slideTo(index);
          },
          // 获取日记
          getGroupList() {
            this.$store.dispatch("getGroups", "123");
          }
      }
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .mdl-list__item {
    padding: 8px 16px;
  }
  
  .mdl-list__item-note {
    @include btn-self;
  }
  
  .find-list-content {
    flex: 1;
    @include flex-column;
    @include flex-vertical-center(flex-start);
    font-size: 12px;
    margin-left: 10px;
    line-height: 16px;
  }
  
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