<template>
  <div class="dynamic_page">
    <list>
      <router-link to="/dynamic/subscrible" class="mdl-navigation__link">
        <list-item text="订阅" to/>
      </router-link>
    </list>
    <list>
      <router-link to="/dynamic/concern/dynamic" class="mdl-navigation__link">
        <list-item text="关注" to/>
      </router-link>
    </list>
    <list>
      <router-link to="/dynamic/group" class="mdl-navigation__link">
        <list-item text="小组" />
      </router-link>
    </list>
    <list>
      <list-item text="晨练" />
      <list-item text="麦田" />
    </list>
  </div>
</template>

<script>

  export default {
    components: {
      "list": require("ui/list.vue"),
      "list-item": require("ui/list-item.vue")
    },
    computed: {}
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .mdl-list {
    padding: 0 16px;
  }
  
  .mdl-list__item {
    padding: 16px 0;
  }
</style>