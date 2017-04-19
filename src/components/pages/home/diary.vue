<template>
  <div class="page-layout">
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
      <div class="channel-tools">
        <i class="material-icons md-20"
           @click="manageChannel">expand_more</i>
      </div>
    </div>
    <div class="page-main">
      <swipe @slidechanged="slideChanged"
             ref="swipe">
        <swipe-slide v-for="channel in channels"
                     :id="channel.id">
          <div class="slide-content">
            <pull-to-refresh :disabled="disableRefresh"
                             @pulltorefresh="pulltorefresh" />
            <div v-if="channelDatas[channel.id]"
                 class="channel-filter-container">
              <div v-for="item in channelDatas[channel.id].filters"
                   @click="switchFilter"
                   :id="item.id"
                   :class="{ active: item.active }"
                   class="channel-filter">
                {{ item.name }}
              </div>
            </div>
            <div v-if="!channelDatas[channel.id]"
                 class="unload">
              (未加载)
            </div>
            <div v-else-if="channelDatas[channel.id].loadstate == 'error'"
                 class="loadstate">
              (加载错误)
            </div>
            <div v-else-if="channelDatas[channel.id].loadstate == 'empty'"
                 class="loadstate">
              (无内容)
            </div>
            <div v-else-if="channelDatas[channel.id].loadstate == 'loading'"
                 class="loadstate">
              <spinner />
            </div>
            <div v-else="channelDatas[channel.id].loadstate == 'ok'">
              <ul class="mdl-list">
                <diary-item v-for="item in channelDatas[channel.id].diaries"
                            :likeCount="item.likeCount"
                            :commentCount="item.commentCount"
                            :avatar="item.avatar"
                            :username="item.username"
                            :text="item.escapedText"
                            :time="item.time" />
              </ul>
              <infinite-scroll v-if="enableInfiniteScroll && channelDatas[channel.id].nomore == false"
                               :onInfinite="infinite">
                <div slot="no-more">没有更多内容了</div>
              </infinite-scroll>
            </div>
          </div>
        </swipe-slide>
      </swipe>
    </div>
  </div>
</template>

<script>
import * as types from "store/mutation-types";
import _ from "lodash";

export default {
  data() {
    return {
      slideContentHeight: 0,
      enableInfiniteScroll: false
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
    disableRefresh() {
      let state = this.$store.getters.getChannelLoadstate;
      return !(state == "ok" || state == "error" || state == "empty");
    },
    channelChanged() {
      return this.$store.state.diary.channelChanged;
    }
  },
  methods: {
    // 如果已经登录，跳转到目标页面，否则跳转到登录页面
    authRoute(to) {
      if (this.authenticated) {
        this.$router.push(to);
      } else {
        this.$router.push({
          path: "/pages/login",
          query: { redirect: to }
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
      this.$store.dispatch("getDiaries");
    },
    switchChannel(event) {
      let label = event.target.id;
      let index = _.findIndex(this.channels, ["id", label]);
      this.$refs.swipe.slideTo(index);
    },
    switchFilter(event) {
      let filter = event.target.id;
      this.$store.commit(types.SWITCH_FILTER, { filter, reload: true });
      this.getDiaries();
    },
    slideChanged(index) {
      let channel = this.channels[index];
      let label = channel.id;

      this.$store.commit(types.SWITCH_CHANNEL, label);
      this.getDiaries();
    },
    pulltorefresh() {
      this.$store.commit(types.SET_RELOAD);
      this.getDiaries();
    },
    infinite(infiniteScroll) {
      this.$store.dispatch("getMoreDiaries", infiniteScroll);
    }
  },
  components: {
    "diary-item": require("components/pages/home/diary-item.vue"),
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
    
    if (this.channelChanged) {
      this.setSlideContentHeight();
      this.$store.commit(types.SET_CHANNEL_CHANGED, false);
      this.$store.commit(types.CLEAR_CHANNEL_DATA);
      setTimeout(() => {
        this.$refs.swipe.reset();
        this.slideChanged(0);
      }, 0);
    }
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