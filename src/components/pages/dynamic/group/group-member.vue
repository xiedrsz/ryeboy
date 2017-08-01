<template>
  <div class="page" :title="title">
    <div class="order" v-show="showOrder">
      <ul>
        <li v-for="(item, index) in orders" @click="order(index)">{{item}}</li>
      </ul>
    </div>

    <div class="page-main">

      <ul class="member-list">
        <li v-for="item in members" class="member-item" @click="$router.push('/pages/user-detail?id=' + item._id)">
          <img :src="item.avatar||'/img/default-avatar.png'" class="lazyload" width="48" height="48" />
          <div class="member-info">
            <div class="member-info-top">
              <span class="member-name">{{item.username+" LV"+(item.level||1)}}</span>
              <span class="member-score">{{(item.score||0)+"分"}}</span>
            </div>
            <div class="member-info-bottom">
              <span class="member-code">入组：{{item.joinTime|time}}</span>
              <!--<span class="member-code">编号：{{item.no||'Todo'}}</span>
                  <span class="member-addgroup-time">入组：{{item.createdAt|time}}</span>-->
            </div>
          </div>
          <a v-show="(groupInfo.creator!==item._id)&&!!item.statusMsg" class="member-delete" @click.stop="expell(item.id, item.statusMsg)">{{item.statusMsg}}</a>
        </li>
      </ul>

      <list v-if="isCreator">
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
      "list-item": require("ui/list-item.vue")
    },
    data() {
      return {
        showOrder: false,
        orders: ['入组时间升序', '入组时间降序'],
        orderBy: 0
      }
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
        },
        isCreator() {
          let user = this.$app.user;
          let creator = this.groupInfo.creator;
          return creator === user._id;
        },
        orderStr() {
          let orderBy = this.orderBy;
          return this.orders[orderBy]
        }
    },
    created() {
      this.getMembers();
    },
    activated() {
      // 排序
      let that = this;
      this.$app.toolbars.create([{
        text: this.orderStr,
        click() {
          that.showOrder = !that.showOrder;
        }
      }]);
    },
    methods: {
      // 获取小组成员
      getMembers() {
          let groupId = this.groupInfo._id;
          const orderCodes = ['date ASC', 'date DESC'];
          let orderBy = this.orderBy;
          orderBy = orderCodes[orderBy];
          this.$store.dispatch("getMembers", {
            groupId,
            orderBy
          });
        },
        // 清退
        expell(userId, statusMsg) {
          if (statusMsg === "清退") {
            this.$store.dispatch("expellMember", {
              userId
            });
          }
        },
        order(index) {
          this.orderBy = index;
          this.showOrder = false;
          
          let that = this;
          this.$app.toolbars.clear();
          this.$app.toolbars.create([{
            text: this.orderStr,
            click() {
              that.showOrder = !that.showOrder;
            }
          }]);
          
          this.getMembers();
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
  
  .order {
    position: absolute;
    background-color: rgb(33, 150, 243);
    color: #fff;
    border: 1px solid #333;
    right: 0;
    li {
      padding: 5px 10px;
    }
    li:active {
      opacity: .6;
    }
  }
</style>