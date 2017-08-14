<template>
  <div class="page" title="小组资料" actions='[{"text":"设置","clickHandler":"group-setting"}]'>
    <div class="page-main">
      <ul class="info-list">
        <li class="info-item">
          <span class="info-left">头像</span>
          <span class="info-right">
            <img :src="avatar" class="lazyload" width="48" height="48" />
            <img v-if="isCreator" src="/img/change-avater.png" class="lazyload" width="48" height="48" @click="changeAvater" />
          </span>
        </li>
        <li class="info-item">
          <span class="info-left">组名</span>
          <span class="info-right">
            <span class="group-name">{{groupInfo.name}}</span>
          </span>
        </li>
        <li class="info-item" @click="$router.push('/dynamic/group-member')">
          <span class="info-left">{{"组员"+groupInfo.memNum+"/"+groupInfo.memMax}}</span>
          <span class="info-right right-arrow">
            <img src="/img/default-avatar.png" class="lazyload" width="36" height="36" />
            <img src="/img/default-avatar.png" class="lazyload" width="36" height="36" />
            <img src="/img/default-avatar.png" class="lazyload" width="36" height="36" />
            <i class="material-icons md-36 navigate_next">navigate_next</i>
          </span>
        </li>

        <!-- 功能未实现，暂时屏蔽 -->
        <!--<li class="info-item">
          <span class="info-left"></span>
          <span class="info-right right-arrow">
            <router-link to='/dynamic/group-card'>
              <span class="group-name">分享小组二维码</span>
            </router-link>
          </span>
        </li>
        <li class="info-item">
          <span class="info-left"></span>
          <span class="info-right right-arrow">
            <router-link to='/dynamic/group-invite'>
              <span class="group-name">邀请我关注的人</span>
            </router-link>
          </span>
        </li>
        <li class="info-item" @click="$router.push('/dynamic/group-grade')">
          <span class="info-left">等级</span>
          <span class="info-right right-arrow">
            <span class="group-name">{{groupInfo.level+"/"+groupInfo.levelMax}}</span>
            <i class="material-icons md-16 group-level">favorite</i>
            <i class="material-icons md-36 navigate_next">navigate_next</i>
          </span>
        </li>
        <li class="info-item" @click="$router.push('/dynamic/group-medal')">
          <span class="info-left">勋章</span>
          <span class="info-right right-arrow">
            <span class="group-name">{{groupInfo.medal+"/"+groupInfo.medalMax}}</span>
            <i class="material-icons md-36 navigate_next">navigate_next</i>
          </span>
        </li>-->
        
        <li class="info-item">
          <span class="info-left">适合人群</span>
          <span class="info-right right-arrow">
            <span class="group-name">{{groupInfo.age_range}} 年龄段</span>
          </span>
        </li>
        <li class="info-item" @click="saveDescrption">
          <span class="info-left">简介</span>
          <span class="info-right right-arrow">
            <span class="group-name">{{groupInfo.description}}</span>
            <i class="material-icons md-36 navigate_next">navigate_next</i>
          </span>
        </li>
        <li class="info-item" @click="goToDiary">
          <span class="info-left">组长</span>
          <user-item :id="groupInfo.creator" class="info-right right-arrow">
            <template scope="props">
              <img :src="props.user.avatar||'/img/default-avatar.png'" class="lazyload" width="36" height="36" />
              <span class="group-name">{{props.user.username}}</span>
              <i class="material-icons md-36 navigate_next" v-if="false">navigate_next</i>
            </template>
          </user-item>
        </li>
        <li class="info-item" @click="$router.push('/dynamic/group-find')">
          <span class="info-left">发现</span>
          <span class="info-right right-arrow">
            <span class="find-more">发现更多小组</span>
            <i class="material-icons md-36 navigate_next">navigate_next</i>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import config from "js/config";

  export default {
    components: {
      "user-item": require("ui/user-item.vue")
    },
    computed: {
      groupInfo() {
          return this.$store.state.group.groupInfo;
        },
        avatar() {
          let tmp = this.groupInfo.avatar
          if (!!tmp) {
            return config.apiAddress + tmp;
          } else {
            return '/img/default-avatar.png';
          }
        },
        isCreator() {
          let user = this.$app.user;
          let creator = this.groupInfo.creator;
          return creator === user._id;
        }
    },
    mounted() {
      // 监听 设置 事件
      this.$on("group-setting", () => {
        // Todo, 判断是否为组长
        let page = "/dynamic/group-setting";
        if (false) {
          // Todo
          let page = "/dynamic/group-setting-??";
        }
        this.$router.push({
          path: page
        });
      });
    },
    methods: {
      // 更换头像，未实现
      changeAvater() {
          this.$router.push({
            path: "/dynamic/group-avatar",
          });
        },
        // 修改群简介，权限：组长
        saveDescrption() {
          this.$router.push({
            path: "/dynamic/group-intro",
          });
        },
        // 跳转到组长日记，有权限
        goToDiary() {
          if (this.isCreator) {
            this.$router.push({
              path: "/pages/personal-diary",
            });
          }
        }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  a {
    color: initial;
    text-decoration: none;
  }
  
  .info-list {
    background: #fff;
    margin-bottom: 5px;
  }
  
  .info-item {
    display: flex;
    align-items: center;
  }
  
  .info-left {
    flex: 0 0 4em;
    width: 4em;
    padding: 0 1em;
    font-size: 14px;
    line-height: 18px;
    color: #a5a5a5;
  }
  
  .info-right {
    flex: 1;
    position: relative;
    min-height: 36px;
    line-height: 36px;
    border-bottom: 1px solid $color-divider;
    padding: 5px 0;
    img + img,
    img + span,
    span + span,
    span + img,
    span + i {
      margin-left: 10px;
    }
    &.right-arrow {
      padding: 5px 36px 5px 0;
    }
  }
  
  .material-icons.navigate_next {
    position: absolute;
    right: 0;
  }
  
  .group-level {
    color: #ff9800;
  }
</style>