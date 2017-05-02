<template>
  <label :for="id"
         class="mdl-checkbox mdl-js-checkbox">
    <input type="checkbox"
           :id="id"
           v-model="checked"
           class="mdl-checkbox__input">
    <span class="mdl-checkbox__label">{{ text }}</span>
  </label>
</template>

<script>
  export default {
    props: {
      id: [Number, String],
      text: String,
      selected: Boolean,
      changed: Function
    },
    data() {
      return {
        checked: this.selected
      };
    },
    watch: {
      selected(newVal) {
        this.checked = newVal;
      },
      checked(newVal, oldVal) {
        if (newVal == oldVal) {
          return;
        }

        if (newVal) {
          this.$el.MaterialCheckbox.check();
        } else {
          this.$el.MaterialCheckbox.uncheck();
        }

        if (this.changed) {
          this.changed({
            id: this.id,
            selected: newVal
          });
        }
      }
    },
    mounted() {
      componentHandler.upgradeElement(this.$el);
    }
  };
</script>