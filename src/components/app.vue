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
    <modal-popue v-show="popue.show"/>
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
    },
    popue() {
      return this.$store.state.page.popue;
    }
  },
  components: {
    "modal-loading": require("components/ui/modal-loading.vue"),
    "modal-dialog": require("components/ui/modal-dialog.vue"),
    "modal-popue": require("components/ui/modal-popue.vue"),
  }
};

</script>