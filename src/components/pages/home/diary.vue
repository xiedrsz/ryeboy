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
        <i class="material-icons md-20">expand_more</i>
      </div>
    </div>
    <div class="page-main">
      <swipe @slidechanged="slideChanged" ref="swipe" >
        <swipe-slide v-for="channel in channels"
                     :id="channel.id">
          <div class="slide-content">
            <div v-if="!channelDatas[channel.id]"
                 class="unload">
              (未加载)
            </div>
            <div v-else-if="channelDatas[channel.id].loadstate == 'error'"
                 class="loadstate">
              (加载错误)
            </div>
            <div v-else-if="channelDatas[channel.id].loadstate == 'loading'"
                 class="loadstate">
              <spinner />
            </div>
            <div v-else="channelDatas[channel.id].loadstate == 'ok'">
              <div class="channel-filter-container">
                <div v-for="item in channelDatas[channel.id].filters"
                     :id="item.id"
                     :class="{ active: item.active }"
                     class="channel-filter">
                  {{ item.name }}
                </div>
              </div>
              <ul class="mdl-list">
                <diary-item v-for="item in channelDatas[channel.id].diaries"
                            :likeCount="item.likeCount"
                            :commentCount="item.commentCount"
                            :avatar="item.avatar"
                            :username="item.username"
                            :text="item.escapedText"
                            :time="item.time" />
              </ul>
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
  computed: {
    channels() {
      return this.$store.state.diary.channels;
    },
    channelDatas() {
      return this.$store.state.diary.channelDatas;
    }
  },
  methods: {
    switchChannel(event) {
      let label = event.target.id;
      let index = _.findIndex(this.channels, ["id", label]);
      this.$refs.swipe.slideTo(index);
    },
    slideChanged(index) {
      let channel = this.channels[index];
      let label = channel.id;

      this.$store.commit(types.SWITCH_CHANNEL, label);
      this.$store.dispatch("getDiaries");
    }
  },
  components: {
    "diary-item": require("components/pages/home/diary-item.vue"),
    "spinner": require("ui/spinner.vue"),
    "swipe": require("ui/swipe.vue"),
    "swipe-slide": require("ui/swipe-slide.vue"),
  },
  mounted() {
    // 调整日记列表高度
    let mainContentHeight = document.querySelector("main").clientHeight;
    this.$el.style.height = mainContentHeight + "px";
    let slideContentHeight = (mainContentHeight - document.querySelector(".channel-container").clientHeight - 1) + "px";
    document.querySelectorAll(".slide-content").forEach(item => {
      item.style.height = slideContentHeight;
    });

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