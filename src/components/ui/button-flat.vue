<template>
  <button class="mdl-button mdl-js-button mdl-button--primary"
          :class="{ border: border }"
          :id="id">{{ text }}</button>
</template>

<script>
  export default {
    props: {
      id: String,
      text: String,
      border: Boolean,
    },
    mounted() {
      componentHandler.upgradeElement(this.$el);
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .border {
    border: 1px solid $color-divider;
  }
</style>