<template>
  <nav>
    <div class="mdl-grid mdl-grid--no-spacing nav-container">
      <div v-for="item in navigationS" class="mdl-cell mdl-cell--3-col mdl-cell--2-col-tablet mdl-cell--1-col-phone">
        <router-link :to="{ path: item.path }" class="mdl-navigation__link">
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
  export default {
    data() {
      return {
        navigationS: [
          { path: "/home/diary", name: "日记" },
          { path: "/home/discipline", name: "功课" },
          { path: "/home/dynamic", name: "动态" },
          { path: "/home/personal", name: "我的" }
        ]
      };
    }
  };

</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .nav-container {
    border-top: 1px solid $color-divider;
    padding: 12px 8px;
    background-color: $color-hint-block;
  }
  
  .mdl-navigation__link {
    color: $color-secondary-text;
    padding: 8px 8px 8px 8px;
  }
  
  .router-link-active {
    color: $color-blue;
  }
</style>