<template>
  <div class="page" title="花生小组">
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
            <ul class="mdl-list">
              <diary-item v-for="item in diaries[channel.id]"
                        :key="item._id"
                        :id="item._id"
                        :userid="item.userid"
                        :like="item.like"
                        :likeCount="item.likeCount"
                        :commentCount="item.commentCount"
                        :avatar="item.avatar"
                        :username="item.username"
                        :pictures="item.pictures"
                        :verified="item.verified"
                        :text="item.escapedText"
                        :userlv="item.userlv"
                        :expectedExp="item.expectedExp"
                        :time="item.time">
              </diary-item>
            </ul>
          </div>
        </swipe-slide>
      </swipe>
    </div>
  </div>
</template>
<script>
  import _ from "lodash";

  export default {
    components: {
      "swipe": require("ui/swipe.vue"),
      "swipe-slide": require("ui/swipe-slide.vue"),
      "diary-item": require("components/pages/home/diary-item.vue")
    },
    data() {
        return {
          channelSelected: "essence"
        };
      },
      activated() {
        // 小组资料
        let that = this;
        this.$app.toolbars.create([{
          text: "小组资料",
          click() {
            let user = that.$app.user;
            let groupId = user.groupId;
            that.$store.dispatch("getGroupInfo", {
              id: groupId,
              callback() {
                that.$router.push({
                  path: '/dynamic/group-info'
                });
              }
            });
          }
        }]);
      },
      created() {
        let diaries = this.$store.state.group.groupDiaries;
        !diaries[0] && this.getDiary();
      },
      computed: {
        channels() {
            return this.$store.state.group.channels;
          },
          diaries() {
            return this.$store.getters.getGroupDiaries;
          }
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
            let user = this.$app.user;
            let groupId = user.groupId;
            this.$store.dispatch("getGroupDiaries", groupId);
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