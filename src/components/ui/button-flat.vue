<template>
  <button class="mdl-button mdl-js-button mdl-button--primary" :id="id">{{ text }}</button>
</template>

<script>
  export default {
    props: {
      id: String,
      text: String,
    },
    mounted() {
      componentHandler.upgradeElement(this.$el);
    }
  };

</script>