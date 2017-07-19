<template>
  <li class="mdl-list__item"
      @click="click"
      :class="{'mdl-list__item--bottom-divider': divider}">
    <span class="mdl-list__item-primary-content">{{ text }}</span>
    <span class="mdl-list__item-secondary-content">{{ secondaryText }}
      <i class="material-icons"
         v-if="route">chevron_right</i>
    </span>
  </li>
</template>

<script>
  export default {
    props: {
      text: String,
      secondaryText: [Number, String],
      route: String,
      divider: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      click() {
        if (this.route) {
          this.$router.push(this.route);
        }
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

  .mdl-list__item-secondary-content i {
    color: $color-disable;
  }
</style>