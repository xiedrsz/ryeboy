<template>
  <div class="page" :title="title" actions='[{"text":"排序","clickHandler":"member-rank"}]'>
    <div class="page-main">
      <ul class="member-list">

        <li v-for="item in members" class="member-item">
          <user-item :id="item.id" class="flex">
            <template scope="props">
              <img :src="props.user.avatar||'/img/default-avatar.png'" class="lazyload" width="48" height="48" />
              <div class="member-info">
                <div class="member-info-top">
                  <span class="member-name">{{props.user.username+" LV"+props.user.level}}</span>
                  <span class="member-score">{{props.user.score+"分"}}</span>
                </div>
                <div class="member-info-bottom">
                  <span class="member-code">入组：{{item.createdAt|time}}</span>
                  <!--<span class="member-code">编号：{{item.no||'Todo'}}</span>
                  <span class="member-addgroup-time">入组：{{item.createdAt|time}}</span>-->
                </div>
              </div>
              <a v-show="!!item.statusMsg" class="member-delete" @click="expell(item.id, item.statusMsg)">{{item.statusMsg}}</a>
            </template>
          </user-item>
        </li>

      </ul>

      <list>
        <router-link to="/dynamic/group-apply" class="mdl-navigation__link">
          <list-item text="群组申请" />
        </router-link>
      </list>
    </div>
  </div>
</template>
<script>
  /**
   * 缺少的接口
   * [1] 清退
   */
  export default {
    components: {
      "list": require("ui/list.vue"),
      "list-item": require("ui/list-item.vue"),
      "user-item": require("ui/user-item.vue"),
    },
    computed: {
      groupInfo() {
          return this.$store.state.group.groupInfo;
        },
        title() {
          let memMax = this.groupInfo.memMax,
            memNum = this.groupInfo.memNum;

          return "小组成员" + memNum + "/" + memMax
        },
        // 小组成员
        members() {
          return this.$store.state.group.members;
        }
    },
    created() {
      !this.members[0] && this.getMembers();
    },
    methods: {
      // 获取小组成员
      getMembers() {
          this.$store.dispatch("getMembers", {
            groupId: "593a4a596d3b3619b82de164"
          });
        },
        // 清退
        expell(userId, statusMsg) {
          if (statusMsg === "清退") {
            this.$store.dispatch("expellMember", {
              userId
            });
          }
        }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .member-item {
    @include flex-row;
    @include flex-vertical-center;
    padding: 5px 15px;
    border-bottom: 1px solid $color-divider;
    .member-info {
      flex: 1;
      @include flex-column;
      span {
        padding-left: 15px;
      }
    }
    .member-delete {
      @include btn-self;
      height: 1em;
      margin: 1em 0;
    }
  }
  
  .flex {
    display: flex;
    flex: 1;
  }
</style>