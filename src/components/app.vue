<template>
  <div id="app" class="mdl-layout__container">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <modal-loading v-show="loading" />
  </div>
</template>

<script>
  export default {
    computed: {
      loading() {
        return this.$store.state.page.loading;
      }
    },
    components: {
      "modal-loading": require("components/ui/modal-loading.vue"),
    }
  };

</script>