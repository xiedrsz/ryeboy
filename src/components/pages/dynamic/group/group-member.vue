<template>
  <div class="page" :title="title" seleted>
    <div class="page-main">
      <ul class="member-list">
        <li v-for="item in groupInfo.members" class="member-item">
          <img :src="item.avatar" class="lazyload" width="48" height="48" />
          <div class="member-info">
            <div class="member-info-top">
              <span class="member-name">{{item.name+" LV"+item.grade}}</span>
              <span class="member-score">{{item.score+"分"}}</span>
            </div>
            <div class="member-info-bottom">
              <span class="member-code">编号：{{item.no}}</span>
              <span class="member-addgroup-time">入组：{{item.date}}</span>
            </div>
          </div>
          <span class="member-delete" @click="expell">清退</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    components: {

    },
    computed: {
      groupInfo() {
          return this.$store.state.group.groupInfo;
        },
        title() {
          let memMax = this.groupInfo.memMax,
            memNum = this.groupInfo.memNum;

          return "小组成员" + memNum + "/" + memMax
        }
    },
    methods: {
      // 清退
      expell() {
        console.log("清退，尚未实现");
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
    }
  }
</style>