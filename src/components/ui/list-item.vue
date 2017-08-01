<template>
  <!--<li class="mdl-list__item" :class="{'mdl-list__item--bottom-divider': divider}">
    <img class="mdl-list__item-icon" v-if="lIcon" :src="lIcon"></img>
    <span class="mdl-list__item-primary-content">{{ text }}</span>
    <span class="mdl-list__item-note" v-if="note">{{ note }}</span>
    <slot name="note"></slot>-->
  <li class="mdl-list__item"
      @click="click"
      :class="{'mdl-list__item--bottom-divider': divider}">
    <img class="mdl-list__item-icon" v-if="lIcon" :src="lIcon"></img>
    <span class="mdl-list__item-primary-content">{{ text }}</span>
    <span class="mdl-list__item-secondary-content">
      <div>{{ secondaryText }}</div>
      <slot name="secondary"></slot>
      <i class="material-icons"
         v-if="route || showRightArrow">chevron_right</i>
    </span>
    <slot name="note"></slot>
  </li>
</template>

<script>
  export default {
    props: {
      text: String,
//      note: String,
      lIcon: String,
      secondaryText: [Number, String],
      route: String,
      divider: {
        type: Boolean,
        default: true
      },
      showRightArrow: {
        type: Boolean,
        default: false
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
  .mdl-list__item-icon {
    margin-right: .5em;
  }
  
  .mdl-list__item-secondary-content {
    font-size: 12px;
    color: $color-secondary-text;
  }

  .mdl-list__item-secondary-content i {
    margin-left: 8px;
    color: $color-disable;
  }
</style>