<template>
  <button class="mdl-button mdl-js-button mdl-button--icon"
          :id="id">
    <i class="material-icons">{{ icon}}</i>
  </button>
</template>

<script>
  export default {
    props: {
      id: String,
      icon: String,
    },
    mounted() {
      componentHandler.upgradeElement(this.$el);
    }
  };
</script>