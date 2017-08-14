<template>
  <div class="page" title="组群申请">
    <ul class="apply-list">

      <li v-for="item in applys" class="mdl-list__item mdl-list__item--bottom-divider">
        <img :src="item.avatar" width="36" height="36" />
        <div class="apply-list-content" @click="$router.push('/pages/user-detail?id=' + item.id)">
          <span class="apply-name">{{item.username}}</span>
          <span class="apply-name">{{"LV"+(item.level||1)}}</span>
        </div>

        <span v-show="item.rejected||item.approved" class="mdl-list__item-note">
          {{item.approved?"已通过":"已拒绝"}}
        </span>

        <span v-show="!item.rejected&&!item.approved" class="mdl-list__item-note">
          <button @click="reject(item.id)" class="mdl-button mdl-js-button mdl-button--fab btn-reject">
            <i class="material-icons">close</i>
          </button>
          <button @click="approve(item.id)" class="mdl-button mdl-js-button mdl-button--fab btn-agree">
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
      this.getApplys();
    },
    methods: {
      // 获取申请列表
      getApplys() {
          this.$store.dispatch("getApplys");
        },
        // 拒绝
        reject(uesrId) {
          this.$store.dispatch("rejectApply", {
            uesrId
          });
        },
        // 同意
        approve(uesrId) {
          this.$store.dispatch("agreeApply", {
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
  
  .flex {
    display: flex;
    flex: 1;
  }
</style>