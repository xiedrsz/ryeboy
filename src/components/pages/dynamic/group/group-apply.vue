<template>
  <div class="page" title="组群申请">
    <ul class="apply-list">

      <li v-for="item in applys" class="mdl-list__item mdl-list__item--bottom-divider">
        <img :src="item.avatar" width="36" height="36" />
        <div class="apply-list-content" @click="detail(item._id)">
          <span class="apply-name">{{item.name}}</span>
          <span class="apply-name">{{"等级："+item.level}}</span>

          <!--<span class="apply-level">申请加入:花生小组</span>
          <span class="apply-info">理由:大海</span>-->
        </div>
        <span v-show="!!item.statusMsg" class="mdl-list__item-note">
          {{item.statusMsg}}
        </span>
        <span v-show="!item.statusMsg" class="mdl-list__item-note">
          <button @click="reject(item._id)" class="mdl-button mdl-js-button mdl-button--fab btn-reject">
            <i class="material-icons">close</i>
          </button>
          <button @click="approve(item._id)" class="mdl-button mdl-js-button mdl-button--fab btn-agree">
            <i class="material-icons">done</i>
          </button>
        </span>
      </li>

    </ul>
  </div>
</template>
<script>
  export default {
    components: {

    },
    computed: {
      applys() {
        return this.$store.state.group.applys;
      }
    },
    created() {
      !this.applys[0] && this.getApplys();
    },
    methods: {
      // 获取申请列表
      getApplys() {
          this.$store.dispatch("getApplys", {
            groupId: "123"
          });
        },
        // 拒绝
        reject(uesrId) {
          this.$store.dispatch("rejectApply", {
            groupId: "123",
            uesrId
          });
        },
        // 同意
        approve(uesrId) {
          this.$store.dispatch("agreeApply", {
            groupId: "123",
            uesrId
          });
        },
        // 查看个人信息，待定
        detail() {
          console.log("查看个人信息，待定");
        }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .mdl-list__item {
    padding: 8px 16px;
  }
  
  .apply-list-content {
    flex: 1;
    @include flex-column;
    @include flex-vertical-center(flex-start);
    font-size: 12px;
    margin-left: 10px;
    line-height: 16px;
  }
  
  .mdl-button--fab {
    height: 24px;
    min-width: 24px;
    width: 24px;
    box-shadow: none;
    &.btn-reject {
      background: $color-orange;
    }
    &.btn-agree {
      background: $color-green;
    }
    .material-icons {
      font-size: 18px;
      color: #fff;
    }
  }
</style>