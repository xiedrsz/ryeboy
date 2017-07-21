<template>
  <div class="page"
       title="个人信息">
    <loadable-content :nomore="true"
                      :loadstate="loadstate">
      <list>
        <list-item text="头像"
                   @click.native="updatePortrait">
          <img slot="secondary"
               class="avatar"
               :src="user.avatar">
        </list-item>
        <list-item text="昵称"
                   route="/pages/personal-info-edit?name=nickname&title=修改昵称"
                   :secondaryText="user.nickname ? user.nickname : '[未填]' "></list-item>
        <list-item text="帐号"
                   :secondaryText="user.username"></list-item>
        <list-item text="邮箱"
                   route="/pages/personal-info-edit?name=email&title=修改邮箱"
                   :secondaryText="user.email ? user.email : '[未填]' "></list-item>
        <list-item text="手机号码"
                   route="/pages/personal-info-edit?name=phone&title=修改手机号码"
                   :secondaryText="user.phone ? user.phone : '[未填]' "></list-item>
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
      },
    },
    components: {
      "list": require("components/ui/list.vue"),
      "list-item": require("components/ui/list-item.vue"),
      "loadable-content": require("ui/loadable-content.vue"),
    },
    methods: {
      async updatePortrait() {
        if (this.$app.deviceready) {
          try {
            let filePath = await this.$app.selectPicture();
            let portrait = Number(this.user.portrait) + 1;
            let filename = `${this.user._id}_${portrait}`;
            await this.$app.uploadPicture(filePath, filename, "portraits");
            await this.$app.api.updateUserInfo(this.$app.userid, "portrait", portrait);
            this.$store.commit("user_updateInfo", {
              name: "portrait",
              content: portrait
            });
          } catch (error) {
            console.log(error);
            this.$app.dialog.text("更换头像失败。");
          }
        } else {
          this.$app.dialog.text("PC端暂未开放该功能。");
        }
      }
    },
    async mounted() {
      try {
        let info = (await this.$app.api.getUserInfo(this.$app.userid)).data;
        this.$store.commit("user_updateInfo", {
          name: "phone",
          content: info.phone
        });
        this.$store.commit("user_updateInfo", {
          name: "email",
          content: info.email
        });
        this.loadstate = "loaded";
      } catch (error) {
        this.loadstate = "error";
      }
    }
  };
</script>

<style scoped>
  .avatar {
    width: 32px;
    height: 32px;
    object-fit: cover;
  }
</style>