<template>
  <div class="mdl-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header mdl-layout--no-drawer-button">
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">麦田男孩</span>
        <div class="mdl-layout-spacer"></div>
        <nav class="mdl-navigation">
          <div class="search-box"
               @click="$router.push('/pages/search')">
            <i class="material-icons md-20">search</i>
            <span>常见问答 | 新人指南</span>
          </div>
        </nav>
      </div>
    </header>
    <main class="mdl-layout__content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </main>
    <navbar></navbar>
  </div>
</template>

<script>
  export default {
    methods: {},
    components: {
      "navbar": require("components/ui/navbar.vue")
    },
    mounted() {}
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .search-box {
    @include flex-row;
    @include flex-vertical-center;
    background-color: #fff;
    color: $color-secondary-text;
    padding: 4px 12px;
    border: 1px solid $color-blue;
    border-radius: 3px;
  }

  .search-box i {
    margin-right: 16px;
  }

  .search-box span {
    font-size: 14px;
  }
</style>