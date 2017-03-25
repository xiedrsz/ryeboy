<template>
  <li class="mdl-list__item" :class="{'mdl-list__item--bottom-divider': divider}">
    <span class="mdl-list__item-primary-content">{{ text }}</span>
  </li>
</template>

<script>
  export default {
    props: {
      text: String,
      divider: {
        type: Boolean,
        default: true
      }
    }
  };

</script>