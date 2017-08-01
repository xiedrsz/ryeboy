<template>
  <div class="searchbox">
    <i class="material-icons md-20">search</i>
    <div class="input-wrap">
      <input type="text"
             v-model="$store.state.search.keyword"
             class="input">
    </div>
    <i class="material-icons md-16"
       @click="$store.state.search.keyword = ''"
       :class="{ white: !$store.state.search.keyword }">clear</i>
  </div>
</template>

<script>
  export default {
    mounted() {
      this.$el.querySelector(".input").style.width = this.$el.querySelector(".input-wrap").clientWidth + "px";
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .searchbox {
    @include flex-row;
    @include flex-vertical-center;
    background-color: #fff;
    color: $color-secondary-text;
    padding: 4px 0px 4px 0px;
    border: 1px solid $color-blue;
    border-radius: 3px;
  }

  .input-wrap {
    flex-grow: 1;
  }

  .input {
    outline: none;
    resize: none;
    border: none;
    color: $color-text;
    width: 0;
  }

  .searchbox i {
    margin-left: 4px;
    margin-right: 4px;
  }

  .white {
    color: #fff;
  }
</style>