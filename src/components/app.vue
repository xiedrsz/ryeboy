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
                  :title="dialog.title" />
  </div>
</template>

<script>
export default {
  computed: {
    loading() {
      return this.$store.state.page.loading;
    },
    dialog() {
      return this.$store.state.page.dialog;
    }
  },
  components: {
    "modal-loading": require("components/ui/modal-loading.vue"),
    "modal-dialog": require("components/ui/modal-dialog.vue"),
  }
};

</script>