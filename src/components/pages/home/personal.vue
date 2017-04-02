<template>
  <div>
    <list v-if="!authenticated">
      <list-item text="登录" v-on:click.native="$router.push('/pages/login')" />
      <list-item text="注册" />
    </list>
    <list v-if="authenticated">
      <list-item text="我的等级" />
      <list-item text="我的日记" />
      <list-item text="我的收藏" />
      <list-item text="我的服务" />
    </list>
    <list>
      <list-item text="设置" :divider="false" v-on:click.native="$router.push('/pages/settings')" />
    </list>
  </div>
</template>

<script>
  export default {
    components: {
      "list": require("ui/list.vue"),
      "list-item": require("ui/list-item.vue")
    },
    computed: {
      authenticated() {
        return this.$store.state.user.authenticated;
      }
    }
  };

</script>