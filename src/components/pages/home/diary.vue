<template>
  <div class="page-layout">
    <div class="channel-container-wrap">
      <div class="channel-container keep-scroll-position">
        <div v-for="item in channels"
             @click="switchChannel(item.id)"
             :key="item.id"
             :class="{ active: item.active }"
             class="channel">
          {{ item.name }}
        </div>
      </div>
      <div class="channel-tools">
        <i class="material-icons md-20"
           @click="manageChannel">expand_more</i>
      </div>
    </div>
    <div class="page-main">
      <swipe @slidechanged="slideChanged"
             ref="swipe">
        <swipe-slide v-for="channel in channels"
                     :key="channel.id">
          <div class="slide-content pulltorefresh keep-scroll-position">
            <div v-if="loadstate(channel.id) !='unload'"
                 class="channel-filter-container">
              <div v-for="item in filters(channel.id)"
                   :key="item.id"
                   :id="item.id"
                   @click="switchFilter(item.id)"
                   :class="{ active: item.active }"
                   class="channel-filter">
                {{ item.name }}
              </div>
            </div>
            <loadable-content :nomore="nomore(channel.id)"
                              :loadstate="loadstate(channel.id)"
                              :infinite="infinite"
                              :pulltorefresh="pulltorefresh">
              <ul class="mdl-list">
                <diary-item v-for="item in diaries(channel.id)"
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
                            :time="item.time"></diary-item>
              </ul>
            </loadable-content>
          </div>
        </swipe-slide>
      </swipe>
    </div>
  </div>
</template>

<script>
  import _ from "lodash";

  export default {
    name: "diary",
    data() {
      return {
        slideContentPosition: 0,
        slideContentHeight: 0,
      };
    },
    computed: {
      authenticated() {
        return this.$store.state.user.authenticated;
      },
      channels() {
        return this.$store.state.diary.channels;
      },
      channelDatas() {
        return this.$store.state.diary.channelDatas;
      },
      channelChanged() {
        return this.$store.state.diary.channelChanged;
      }
    },
    methods: {
      diaries(id) {
        return this.channelDatas[id] ? this.channelDatas[id].diaries : [];
      },
      filters(id) {
        return this.channelDatas[id] ? this.channelDatas[id].filters : [];
      },
      nomore(id) {
        return this.channelDatas[id] ? this.channelDatas[id].nomore : true;
      },
      loadstate(id) {
        return this.channelDatas[id] ? this.channelDatas[id].loadstate : "unload";
      },
      // 如果已经登录，跳转到目标页面，否则跳转到登录页面
      authRoute(to) {
        if (this.authenticated) {
          this.$router.push(to);
        } else {
          this.$router.push({
            path: "/pages/login",
            query: {
              redirect: to
            }
          });
        }
      },
      setSlideContentHeight() {
        document.querySelectorAll(".slide-content").forEach(item => {
          item.style.height = this.slideContentHeight;
        });
      },
      manageChannel() {
        this.authRoute("/pages/channel-manage");
      },
      getDiaries() {
        this.$store.dispatch("diary_getData");
      },
      switchChannel(id) {
        let index = _.findIndex(this.channels, ["id", id]);
        this.$refs.swipe.slideTo(index);
      },
      switchFilter(id) {
        let filter = id;
        this.$store.commit("diary_switchFilter", {
          filter,
          reload: true
        });
        this.getDiaries();
      },
      slideChanged(index) {
        let channel = this.channels[index];
        let label = channel.id;

        this.$store.commit("diary_switchChannel", label);
        this.getDiaries();
      },
      pulltorefresh() {
        this.$store.commit("diary_setReload");
        this.getDiaries();
      },
      async infinite() {
        await this.$store.dispatch("diary_getMoreData");
      }
    },
    components: {
      "diary-item": require("components/pages/home/diary-item.vue"),
      "swipe": require("ui/swipe.vue"),
      "swipe-slide": require("ui/swipe-slide.vue"),
    },
    activated() {
      if (this.channelChanged) {
        this.setSlideContentHeight();
        this.$store.commit("diary_setChannelChanged", false);
        this.$store.commit("diary_clearChannelData");
        setTimeout(() => {
          this.$refs.swipe.reset();
          this.slideChanged(0);
        }, 0);
      }

      this.__restorePosition();
    },
    mounted() {
      // 调整日记列表高度
      let mainContentHeight = document.querySelector("main").clientHeight;
      this.$el.style.height = mainContentHeight + "px";
      this.slideContentHeight = (mainContentHeight - document.querySelector(".channel-container").clientHeight - 1) + "px";
      this.setSlideContentHeight();
      this.slideChanged(0);
    }
  };
</script>

<style lang="scss"
       scoped>
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

  .channel-tools {
    @include flex-column;
    @include flex-center;
    height: 36px;
    width: 48px;
    min-width: 48px;
    color: $color-hint-text;
    background-color: $color-hint-block;
  }

  .channel-tools i {
    padding: 4px 0px 4px 4px;
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

  .mdl-list {
    padding: 0;
    margin: 8px 16px;
  }

  .mdl-list li {
    margin-bottom: 32px;
  }
</style>