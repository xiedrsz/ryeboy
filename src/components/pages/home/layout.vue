<template>
  <div class="mdl-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header mdl-layout--no-drawer-button">
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">麦田男孩</span>
        <div class="mdl-layout-spacer"></div>
        <nav class="mdl-navigation">
          <router-link to="/pages/search" class="mdl-navigation__link">
            <i class="material-icons">search</i>
          </router-link>
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
  components: {
    "navbar": require("components/ui/navbar.vue")
  }
};
</script>