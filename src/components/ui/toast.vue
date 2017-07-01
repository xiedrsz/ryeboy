<template>
  <div class="mdl-js-snackbar mdl-snackbar">
    <div class="mdl-snackbar__text"></div>
    <button type="button"
            class="mdl-snackbar__action"></button>
  </div>
</template>

<script>
  export default {
    mounted() {
      componentHandler.upgradeElement(this.$el);
    }
  };
</script>