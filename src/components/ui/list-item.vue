<template>
  <li class="mdl-list__item"
      :class="{'mdl-list__item--bottom-divider': divider}">
    <span class="mdl-list__item-primary-content">{{ text }}</span>
    <span class="mdl-list__item-secondary-content">{{ secondaryText }}</span>
  </li>
</template>

<script>
  export default {
    props: {
      text: String,
      secondaryText: [Number, String],
      divider: {
        type: Boolean,
        default: true
      }
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .mdl-list__item-secondary-content {
    font-size: 14px;
    color: $color-secondary-text;
  }
</style>