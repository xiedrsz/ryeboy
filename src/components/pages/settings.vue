<template>
  <div>
    <list>
      <list-item text="修改密码"
                 v-if="authenticated" />
      <list-item text="设置隐私密码"
                 v-if="authenticated" />
      <list-item text="检查版本"
                 :divider="false" />
    </list>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.commit("setTitle", "设置");
  },
  components: {
    "list": require("components/ui/list.vue"),
    "list-item": require("components/ui/list-item.vue")
  },
  computed: {
    authenticated() {
      return this.$store.state.user.authenticated;
    }
  }
};

</script>