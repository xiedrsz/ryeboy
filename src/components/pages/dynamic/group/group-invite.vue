<template>
  <div class="page" title="邀请好友">

    <label v-for="item in concern" class="invite-list">
      <div class="invite-item">
        <img :src="item.avatar" class="lazyload" width="48" height="48" />
          <span class="invite-content">{{item.username}}</span>
          <input type="checkbox" @click="check(item)">
          <i class="material-icons">{{item.checked?'check_circle':'radio_button_unchecked'}}</i>
      </div>
    </label>

    <button @click="invite" class="mdl-button mdl-js-button">邀请加入</button>
  </div>
</template>
<script>
  export default {
    components: {
    },
    data() {
      return {
        checked: true
      }
    },
    created() {
      !this.concern[0] && this.getConcern();
    },
    computed: {
      concern() {
        return this.$store.state.concern.concern;
      }
    },
    methods: {
      // 获取关注人
      getConcern() {
          this.$store.dispatch("getConcern");
        },
        // 邀请
        invite() {
          this.$store.dispatch("inviteFriends", {
            userId: "123",
            callback: () => {
              window.history.go(-1);
            }
          });
        },
        // 选择
        check(item) {
          this.$store.commit("concern_checked", item);
        }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .invite-item {
    @include flex-row;
    @include flex-vertical-center;
    padding: 5px 15px;
    border-bottom: 1px solid $color-divider;
    .invite-content {
      flex: 1;
      @include flex-column;
      padding-left: 15px;
    }
    input {
      visibility: hidden;
    }
  }
  
  .mdl-js-button {
    width: 100%;
    height: 44px;
    border-radius: 4px;
    background: $color-red;
    color: #fff;
  }
</style>