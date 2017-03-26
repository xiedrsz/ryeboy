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
    <div v-if="authenticated"
         style="margin-top: 64px; text-align: center">
      <button-flat text="退出登录"
                   @click.native="logout" />
    </div>
  </div>
</template>

<script>
import api from "api";

export default {
  created() {
    this.$store.commit("setTitle", "设置");
  },
  components: {
    "button-flat": require("components/ui/button-flat.vue"),
    "list": require("components/ui/list.vue"),
    "list-item": require("components/ui/list-item.vue")
  },
  methods: {
    logout() {
      api.logout();

      localStorage.removeItem("authenticated");
      this.$store.commit("deleteUserAuth");
      this.$router.replace("/");
    }
  },
  computed: {
    authenticated() {
      return this.$store.state.user.authenticated;
    }
  }
};

</script>