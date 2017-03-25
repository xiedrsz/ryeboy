<template>
  <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" :id="id">{{ text }}</button>
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