<template>
  <div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active">
  </div>
</template>

<script>
export default {
  mounted: function () {
    componentHandler.upgradeElement(this.$el);
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/main.scss";
.mdl-spinner {
  width: 16px;
  height: 16px
}
</style>