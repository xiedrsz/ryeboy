<template>
  <li class="mdl-list__item" :class="{'mdl-list__item--bottom-divider': divider}">
    <img class="mdl-list__item-icon" v-if="lIcon" :src="lIcon"></img>
    <span class="mdl-list__item-primary-content">{{ text }}</span>
    <span class="mdl-list__item-note" v-if="note">{{ note }}</span>
    <slot name="note"></slot>
  </li>
</template>

<script>
  export default {
    props: {
      text: String,
      note: String,
      lIcon: String,
      divider: {
        type: Boolean,
        default: true
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .mdl-list__item-note {
      @include btn-self;
  }
  
  .mdl-list__item-icon {
    margin-right: 10px;
  }
</style>