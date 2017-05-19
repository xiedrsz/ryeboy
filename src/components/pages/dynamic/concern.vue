<template>
  <div class="page" title="关注" actions='[{"text":"添加","clickHandler":"concern-add"}]'>
    <nav>
      <div class="mdl-grid mdl-grid--no-spacing nav-container">
        <div v-for="item in overview" class="nav-item">
          <router-link :to="{ path: item.path }" replace class="mdl-navigation__link">
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </nav>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    computed: {
      overview() {
        return this.$store.state.concern.overview;
      }
    },
    mounted() {
      // 监听 添加 事件
      this.$on("concern-add", () => {
        this.$router.push({
          path: '/dynamic/concernadd'
        })
      })
    },
    activated() {
      // 获取 关注概述
      this.$store.dispatch("getOverview");
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
  
  .nav-item {
    flex: 1;
    text-align: center;
  }
</style>