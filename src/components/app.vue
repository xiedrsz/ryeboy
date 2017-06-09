<template>
  <div id="app"
       class="mdl-layout__container">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <modal-loading v-show="loading" />
    <modal-dialog v-show="dialog.show"
                  :type="dialog.type"
                  :content="dialog.content"
                  :title="dialog.title"
                  @ok="$emit(dialog.event.ok)"
                  @cancel="$emit(dialog.event.cancel)" />
    <action-sheet v-show="actionSheet.show"
                  @actionClick="emit"
                  :actions="actionSheet.actions" />
  </div>
</template>

<script>
  export default {
    methods: {},
    computed: {
      loading() {
        return this.$store.state.page.loading;
      },
      dialog() {
        return this.$store.state.page.dialog;
      },
      actionSheet() {
        return this.$store.state.page.actionSheet;
      }
    },
    components: {
      "modal-loading": require("components/ui/modal-loading.vue"),
      "modal-dialog": require("components/ui/modal-dialog.vue"),
      "action-sheet": require("components/ui/action-sheet.vue"),
    },
    mounted() {
      this.$on("exit", () => {
        navigator.app.exitApp();
      });
    }
  };
</script>