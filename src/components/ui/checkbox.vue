<template>
  <label :for="id"
         class="mdl-checkbox mdl-js-checkbox">
    <input type="checkbox"
           :id="id"
           :disabled="disabled"
           v-model="model"
           class="mdl-checkbox__input">
    <span class="mdl-checkbox__label">{{ text }}</span>
  </label>
</template>

<script>
  export default {
    model: {
      prop: "checked",
      event: "change",
    },
    props: {
      id: [Number, String],
      text: String,
      checked: Boolean,
      disabled: Boolean,
      changed: Function
    },
    watch: {
      checked(newVal) {
        if (newVal) {
          this.$el.MaterialCheckbox.check();
        } else {
          this.$el.MaterialCheckbox.uncheck();
        }
      }
    },
    computed: {
      model: {
        get() {
          return this.checked;
        },
        set(newVal) {
          this.$emit("change", newVal);

          if (this.changed) {
            this.changed({
              id: this.id,
              checked: newVal
            });
          }
        },
      },
    },
    mounted() {
      componentHandler.upgradeElement(this.$el);
    }
  };
</script>