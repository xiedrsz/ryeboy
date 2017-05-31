<template>
  <div class="page" title="小组等级">
    <div class="page-main">
      <div class="star-box">
        <div class="star-list">
          <i class="material-icons md-24 star-light">star</i>
          <i class="material-icons md-24 star-light">star</i>
          <i class="material-icons md-24 star-gray">star</i>
          <i class="material-icons md-24 star-gray">star</i>
          <i class="material-icons md-24 star-gray">star</i>
        </div>
        <span class="grade-code">{{"LV" + groupInfo.grade +" "+ groupInfo.gradeNum+"/"+groupInfo.gradeMax}}</span>
      </div>
      
      <div class="grade-box">
        <div class="grade-title">
          <span>等级说明</span>
        </div>
        <div class="grade-intro-item">
          <span class="grade-intro-level">LV1</span>
          <span class="grade-intr-num">成员上限30人</span>
          <span class="grade-help-name">互助分100</span>
          <span class="grade-help-score">100</span>
        </div>
      </div>
      
      <div class="grade-box">
        <div class="grade-title">
          <span>得分说明</span>
        </div>
        <div class="score-intro-item" :class="{'flex-wrap':extra}">
          <span class="score-intro-name">晨练</span>
          <span class="score-help-name">互助分</span>
          <span class="score-help">３</span>
          <span class="extra" v-show="extra">每日最多得３分</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
        return {
          extra: true
        }
      },
      components: {

      },
      computed: {
        groupInfo() {
          return this.$store.state.group.groupInfo;
        }
      }
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .page-main {
    padding: 0 15px;
  }
  
  .star-box {
    @include flex-column;
    text-align: center;
    padding: 15px 0;
  }
  
  .star-light {
    color: $color-light-yellow;
  }
  
  .star-gray {
    color: $color-gray;
  }
  
  .grade-box {
    .grade-title {
      @include flex-row;
      @include flex-vertical-center;
      height: 36px;
      border-bottom: 1px solid $color-divider;
    }
  }
  
  .grade-intro-item,
  .score-intro-item {
    display: flex;
    align-items: center;
    padding: 5px 0;
    border-bottom: 1px solid $color-divider;
    color: $color-gray;
    span {
      text-align: left;
    }
    .grade-intro-level {
      flex: 0 0 20%;
      width: 10%;
    }
    .grade-intr-num {
      flex: 0 0 40%;
      width: 40%;
    }
    .grade-help-name {
      flex: 0 0 25%;
      width: 25%;
    }
    .grade-help-score {
      flex: 0 0 15%;
      width: 15%;
    }
    .score-intro-name {
      flex: 0 0 70%;
      width: 70%;
    }
    .score-help-name {
      flex: 0 0 20%;
      width: 20%;
    }
    .score-help {
      flex: 0 0 10%;
      width: 10%;
    }
    .extra {
      flex: 0 0 100%;
      width: 100%;
      text-align: right;
      color: $color-light-yellow;
    }
  }
</style>