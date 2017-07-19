<template>
  <div class="page"
       title="个人信息">
    <loadable-content :nomore="true"
                      :loadstate="loadstate">
      <list>
        <list-item text="头像"></list-item>
        <list-item text="昵称"></list-item>
        <list-item text="帐号"
                   :secondaryText="user.username"></list-item>
        <list-item text="邮箱"></list-item>
        <list-item text="性别"></list-item>
        <list-item text="手机号码"></list-item>
      </list>
    </loadable-content>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loadstate: "loading",
      };
    },
    computed: {
      user() {
        return this.$store.state.user;
      }
    },
    components: {
      "list": require("components/ui/list.vue"),
      "list-item": require("components/ui/list-item.vue"),
      "loadable-content": require("ui/loadable-content.vue"),
    },
    async mounted() {
      try {
        // let status = (await this.$app.api.getUserStatus(this.$app.userid)).data;
        // status.level = this.$app.textHelper.getUserIdent(status.studentLevel);
        // this.$set(this.$data, "status", status);
        this.loadstate = "loaded";
      } catch (error) {
        this.loadstate = "error";
      }
    }
  };
</script>