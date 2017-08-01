<template>
  <div id="app"
       class="mdl-layout__container">
    <keep-alive :include="'home'">
      <router-view></router-view>
    </keep-alive>

    <!-- 全屏组件 -->
    <modal-loading v-show="loading"></modal-loading>
    <modal-dialog v-show="dialog.show"
                  :type="dialog.type"
                  :content="dialog.content"

                  :title="dialog.title"
                  @ok="dialogOkCallback"
                  @cancel="dialogCancelCallback"></modal-dialog>
    <modal-popue v-show="popue.show"/>
    <modal-login ref="login"></modal-login>
    <action-sheet v-show="actionSheet.show"
                  :actions="actionSheet.actions"></action-sheet>
    <gallery ref="gallery"></gallery>
    <toast ref="toast"></toast>
  </div>
</template>

<script>
  export default {
    methods: {
      dialogOkCallback() {
        if (this.dialog.okCallback) {
          this.dialog.okCallback();
          this.dialog.okCallback = null;
        }
      },
      dialogCancelCallback() {
        if (this.dialog.cancelCallback) {
          this.dialog.cancelCallback();
          this.dialog.cancelCallback = null;
        }
      },
    },
    computed: {
      loading() {
        return this.$store.state.page.loading;
      },
      dialog() {
        return this.$store.state.page.dialog;
      },
      actionSheet() {
        return this.$store.state.page.actionSheet;
      },
      dialog() {
        return this.$store.state.page.dialog;
      },
      popue() {
        return this.$store.state.page.popue;
      }
    },
    components: {
      "modal-loading": require("components/ui/modal-loading.vue"),
      "modal-dialog": require("components/ui/modal-dialog.vue"),
      "modal-popue": require("components/ui/modal-popue.vue"),
      "modal-login": require("components/ui/modal-login.vue"),
      "action-sheet": require("components/ui/action-sheet.vue"),
      "gallery": require("ui/gallery.vue"),
      "toast": require("ui/toast.vue"),
    }
  };
</script>