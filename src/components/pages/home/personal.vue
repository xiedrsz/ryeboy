<template>
  <div>
    <ul v-if="!authenticated" class="mdl-list">
      <list-item text="登录" />
      <list-item text="注册" />
    </ul>
    <ul v-if="authenticated" class="mdl-list">
      <list-item text="我的等级" />
      <list-item text="我的日记" />
      <list-item text="我的收藏" />
      <list-item text="我的服务" />
    </ul>
    <ul class="mdl-list">
      <list-item text="设置" :divider="false" />
    </ul>
  </div>
</template>

<script>
  export default {
    components: {
      "list-item": require("components/ui/list-item.vue")
    },
    computed: {
      authenticated() {
        return this.$store.state.user.authenticated;
      }
    }
  };

</script>