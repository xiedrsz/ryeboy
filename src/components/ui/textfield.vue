<template>
  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
    <input class="mdl-textfield__input" :type="type" :value="value" :id="id" @input="fireInputEvent">
    <label class="mdl-textfield__label" :for="id">{{ label }}</label>
  </div>
</template>

<script>
  export default {
    props: {
      id: String,
      label: String,
      value: {
        required: false
      },
      type: {
        type: String,
        default: "text"
      },
    },
    mounted() {
      componentHandler.upgradeElement(this.$el);
    },
    methods: {
      fireInputEvent: function (event) {
        this.$emit("input", event.target.value);
      }
    }
  };

</script>