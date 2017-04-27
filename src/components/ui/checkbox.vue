<template>
  <label :for="id"
         class="mdl-checkbox mdl-js-checkbox">
    <input type="checkbox"
           :id="id"
           class="mdl-checkbox__input">
    <span class="mdl-checkbox__label">{{ text }}</span>
  </label>
</template>

<script>
  export default {
    props: {
      id: String,
      text: String
    },
    mounted() {
      componentHandler.upgradeElement(this.$el);
    }
  };
</script>