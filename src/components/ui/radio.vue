<template>
  <label :for="id"
         class="mdl-radio mdl-js-radio">
    <input type="radio"
           :id="id"
           :name="name"
           :value="value"
           :disabled="disabled"
           v-model="model"
           class="mdl-radio__button">
    <span class="mdl-radio__label">{{ text }}</span>
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
      name: String,
      value: String,
      checked: String,
      disabled: Boolean,
      changed: Function
    },
    watch: {
      checked(newVal) {
        if (newVal == this.value) {
          this.$el.MaterialRadio.check();
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