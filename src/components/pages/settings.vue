<template>
  <div class="page"
       title="设置">
    <list>
      <list-item text="修改密码"
                 v-if="authenticated" />
      <list-item text="设置隐私密码"
                 v-if="authenticated" />
      <list-item text="清除本地缓存"
                 @click.native="clearLocalStorage" />
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
import * as types from "store/mutation-types";

export default {
  components: {
    "button-flat": require("components/ui/button-flat.vue"),
    "list": require("components/ui/list.vue"),
    "list-item": require("components/ui/list-item.vue")
  },
  methods: {
    logout() {
      api.logout();

      localStorage.removeItem("authenticated");
      this.$store.commit(types.DELETE_USER_AUTH);
      this.$router.replace("/");
    },
    clearLocalStorage() {
      localStorage.clear();
      this.$store.commit(types.SHOW_DIALOG, {
        show: true,
        type: "alert",
        content: "本地缓存已经清除"
      });
    }
  },
  computed: {
    authenticated() {
      return this.$store.state.user.authenticated;
    }
  }
};

</script>