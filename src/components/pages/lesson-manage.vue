<template>
  <div class="page"
       title="功课管理">
    <div class="page-content">
      <div class="subscribed">
        <div class="title-row">
          <div>更换功课</div>
          <div class="mdl-layout-spacer"></div>
          <div>难度大改善值多</div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  import api from "api";
  import _ from "lodash";
  import * as types from "store/mutation-types";

  export default {
    data() {
      return {
        optionalLessons:[],
      };
    },
    mounted() {

    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .title-row {
    @include flex-row;
    width: 100%;
  }
</style>