<template>
  <div class="page" title="小组列表">
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

            <loadable-content :nomore="gNomore[channel.id]" loadstate="infin" :infinite="getMore(channel.id)">
              <ul class="find-list">
                <li class="mdl-list__item mdl-list__item--bottom-divider" v-for="(item, index) in groups[channel.id]" @click="view(item)">
                  <img :src="item.avatar||'/img/default-avatar.png'" width="36" height="36" />
                  <div class="find-list-content">
                    <span class="group-name">{{item.name}}</span>
                    <!-- 功能未完善，暂时屏蔽 -->
                    <!--<span class="group-level"> {{item.level+"/"+item.levelMax}}
                      <i v-for="i in new Array(item.level)" class="material-icons md-12 star-gray">star</i>
                    </span>-->
                    <span class="group-info">小组描述:{{item.description}}</span>
                  </div>
                  <span v-if="item.note" @click.stop="join(item._id, item.note)" class="mdl-list__item-note" :class="{'disabled':item.note!=='加入'}">{{item.note}}</span>
                </li>
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
    components: {
      "spinner": require("ui/spinner.vue"),
      "swipe": require("ui/swipe.vue"),
      "swipe-slide": require("ui/swipe-slide.vue"),
      "pull-to-refresh": require("ui/pull-to-refresh.vue")
    },
    data() {
      return {
        classSelected: "newest"
      };
    },
    computed: {
      groupClass() {
          return this.$store.state.group.groupClass;
        },
        groups() {
          return this.$store.getters.getGroupList;
        },
        gNomore() {
          return this.$store.state.group.gNomore;
        },
        groupInfo() {
          return this.$store.state.group.groupInfo;
        }
    },
    activated() {
      // 监听 创建组 事件
      let that = this;
      let options = [{
        icon: "search",
        click() {
          console.log('search');
        }
        }];
      let user = this.$app.user;
      let lv = user.grade.lv || 1;
      let isCreator = this.groupInfo.creator === user.id

      if (!isCreator && lv > 20) {
        options.push({
          icon: "add",
          click() {
            that.$router.push({
              path: '/dynamic/group-create-one'
            });
          }
        });
      }
      this.$app.toolbars.create(options);
    },
    methods: {
      // 侧滑
      slideChanged(index) {
          this.classSelected = this.groupClass[index].id;
        },
        // 切换频道
        switchChannel(id) {
          this.classSelected = id;
          let index = _.findIndex(this.groupClass, ["id", id]);
          this.$refs.swipe.slideTo(index);
        },
        // 获取小组
        getMore(filter) {
          let that = this;
          async function infinite() {
            await that.$store.dispatch("getGroups", {
              filter
            });
          }
          return infinite;
        },
        // 加入小组
        join(id, note) {
          if (note == "加入") {
            let user = this.$app.user;
            this.$store.dispatch("addGroup", {
              groupId: id,
              userId: user.id
            });
          }
        },
        // 查看小组资料
        view(group) {
          let groupId = group._id;
          let that = this;
          this.$store.dispatch("getGroupInfo", {
            id: groupId,
            callback() {
              that.$router.push({
                path: '/dynamic/group-info'
              });
            }
          });
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
  
  .disabled {
    background-color: $color-disable;
  }
  
  .find-list-content {
    flex: 1;
    @include flex-column;
    @include flex-vertical-center(flex-start);
    font-size: 12px;
    margin-left: 10px;
    line-height: 16px;
  }
  
  .group-name {
    font-size: 14px;
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
  
  // 调整侧滑组件背景颜色，以防文字重叠
  .swipe-slide {
    background-color: #fff;
  }
</style>