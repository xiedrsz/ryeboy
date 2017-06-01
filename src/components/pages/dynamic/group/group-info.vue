<template>
  <div class="page" title="小组资料">
    <div class="page-main">
      <ul class="info-list">
        <li class="info-item">
          <span class="info-left">头像</span>
          <span class="info-right">
            <img :src="groupInfo.avatar" class="lazyload" width="48" height="48" />
            <img src="/img/change-avater.png" class="lazyload" width="48" height="48" @click="changeAvater" />
          </span>
        </li>
        <li class="info-item">
          <span class="info-left">组名ID</span>
          <span class="info-right">
            <span class="group-name">{{groupInfo.name}}</span>
            <span class="group-id">{{"ID:"+groupInfo.id}}</span>
          </span>

        </li>
        <li class="info-item">
          <span class="info-left">{{"组员"+groupInfo.memNum+"/"+groupInfo.memMax}}</span>
          <span class="info-right">
            <img src="/img/default-avatar.png" class="lazyload" width="36" height="36" />
            <img src="/img/default-avatar.png" class="lazyload" width="36" height="36" />
            <img src="/img/default-avatar.png" class="lazyload" width="36" height="36" />
            <router-link to='/dynamic/group-member'>
              <i class="icon icon-right"></i>
            </router-link>
          </span>
        </li>

        <li class="info-item">
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
      </ul>
      <ul class="info-list">
        <li class="info-item">
          <span class="info-left">等级</span>
          <span class="info-right right-arrow">
            <span class="group-name">{{groupInfo.gradeNum+"/"+groupInfo.gradeMax}}</span>
            <i class="material-icons md-16 group-level">favorite</i>
            <router-link to='/dynamic/group-grade'>
              <i class="icon icon-right"></i>
            </router-link>
          </span>
        </li>
        <li class="info-item">
          <span class="info-left">勋章</span>
          <span class="info-right right-arrow">
            <span class="group-name">{{groupInfo.medalNum+"/"+groupInfo.medalMax}}</span>
            <router-link to='/dynamic/group-medal'>
              <i class="icon icon-right"></i>
            </router-link>
          </span>
        </li>
      </ul>
      <ul class="info-list">
        <li class="info-item">
          <span class="info-left">适合人群</span>
          <span class="info-right right-arrow">
            <span class="group-name">{{groupInfo.minAge+"-"+groupInfo.maxAge}} 年龄段</span>
          </span>
        </li>
        <li class="info-item" @click="saveDescrption">
          <span class="info-left">简介</span>
          <span class="info-right">
            <span class="group-name">{{groupInfo.descrption}}</span>
            <i class="icon icon-right"></i>
          </span>
        </li>
        <li class="info-item" @click="goToDiary">
          <span class="info-left">组长</span>
          <span class="info-right right-arrow">
            <img src="/img/default-avatar.png" class="lazyload" width="36" height="36" />
            <span class="group-name">你就会更好</span>
          </span>
        </li>
      </ul>
      <ul class="info-list">
        <li class="info-item">
          <span class="info-left">发现</span>
          <span class="info-right right-arrow">
            <router-link to='/dynamic/group-find'>
              <span class="find-more">发现更多小组</span>
            </router-link>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
        return {
          msg: '如果你无法简洁的表达你的想法，那只说明你还不够了解它..'
        }
      },
      components: {

      },
      computed: {
        groupInfo() {
          return this.$store.state.group.groupInfo;
        }
      },
      created() {
        this.getGroupInfo();
      },
      mounted() {
        console.log(this.groupInfo)
      },
      methods: {
        // 获取小组信息
        getGroupInfo() {
            !this.groupInfo.id && this.$store.dispatch("getGroupInfo", "123");
          },
          // 更换头像，未实现
          changeAvater() {
            console.log("更换头像，未实现");
          },
          // 修改群简介，权限：组长
          saveDescrption() {
            // Todo
            console.log("未完成，组长才可以修改");
            if (true) {
              this.$router.push({
                path: "/dynamic/group-intro",
              });
            }
          },
          // 
          goToDiary() {
            // Todo
            console.log("如果是组长，跳到日记页面，为实现");
            if (true) {
              this.$router.push({
                path: "/home/diary",
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
    flex: 0 0 3em;
    width: 3em;
    padding: 0 1em;
    font-size: 14px;
    line-height: 18px;
    color: #a5a5a5;
  }
  
  .info-right {
    flex: 1;
    display: flex;
    align-items: center;
    min-height: 34px;
    border-bottom: 1px solid $color-divider;
    padding: 5px 0;
    img + img,
    img + span,
    span + span,
    span + img,
    span + i {
      margin-left: 10px;
    }
  }
  
  .info-right.right-arrow {
    padding: 5px 20px 5px 0;
  }
  
  .group-level {
    color: #ff9800;
  }
</style>