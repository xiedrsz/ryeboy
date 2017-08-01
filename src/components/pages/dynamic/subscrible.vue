<template>
  <div class="page" title="我订阅的" actions='[{"text":"添加","clickHandler":"add-subscrible"}]'>
    <router-link to="/dynamic/concern/dynamic" class="mdl-navigation__link">
      <list-item text="我的关注" to/>
    </router-link>

    <ul class="sub-list">

      <li class="sub-item" @click="goChannels" v-for="subscrible in subscribles">
        <div class="material-icons mdl-badge mdl-badge--overlap" :data-badge="99|msgNum">
          <img src="/img/default-avatar.png" width="36" height="36" />
        </div>
        <div class="item-content">
          <span class="sub-name">{{"陈翔6.半"}}</span>
          <span class="sub-info">{{"subscrible.descrption"}}</span>
        </div>
        <span class="sub-time">{{"2007-07-1 11:29:02"|ago}}</span>
      </li>

    </ul>
  </div>
</template>
<script>
  export default {
    data() {
        return {}
      },
      components: {
        "list": require("ui/list.vue"),
        "list-item": require("ui/list-item.vue")
      },
      computed: {
        subscribles() {
          return this.$store.state.subscrible.subscribles;
        }
      },
      activated() {
        // 获取 关注概述
        this.$store.dispatch("getSubscribles");

        // 添加
        let that = this;
        this.$app.toolbars.create([{
          text: "添加",
          click() {
            that.$router.push({
              path: "/dynamic/subscrible-manage"
            });
          }
        }]);
      },
      methods: {
        goChannels() {
          this.$router.push({
            path: '/dynamic/spallation'
          })
        }
      }
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .sub-list {
    border-top: 8px solid #ddd;
  }
  
  .sub-item {
    @include flex-row;
    padding: 15px;
    border-bottom: 1px solid $color-divider;
    .item-content {
      flex: 1;
      margin-left: 5px;
      span {
        display: block;
        line-height: 20px;
        &.sub-info {
          font-size: 12px;
        }
      }
    }
    .sub-time {
      font-size: 12px;
    }
    .mdl-badge:after {
      color: #fff;
      background: $color-red;
      top: -9px;
      right: -9px;
    }
  }
</style>