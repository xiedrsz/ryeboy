<template>
  <div class="searchbox">
    <i class="material-icons md-20">search</i>
    <input type="text"
           v-model="$store.state.search.keyword"
           class="input">
  </div>
</template>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .searchbox {
    @include flex-row;
    @include flex-vertical-center;
    background-color: #fff;
    color: $color-secondary-text;
    padding: 4px 12px;
    border: 1px solid $color-blue;
    border-radius: 3px;
  }

  .searchbox input {
    outline: none;
    resize: none;
    border: none;
    margin-left: 8px;
    color: $color-text;
  }
</style>