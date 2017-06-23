<template>
  <div class="mdl-dialog-container">
    <div class="mdl-dialog">
      <div class="mdl-dialog__actions mdl-dialog__actions--full-width">
        <button v-for="action in actions"
                type="button"
                class="mdl-button"
                @click="eventHandler(action.click)">{{ action.text }}</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      actions: Array
    },
    methods: {
      eventHandler(click) {
        this.$store.commit("page_showActionSheet", {
          show: false,
          actions: []
        });
        if (click) {
          click();
        }
      }
    }
  };
</script>

<style scoped>
  .mdl-dialog-container {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-end;
    top: 0;
    left: 0;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.3);
  }

  .mdl-dialog-container .mdl-dialog {
    background-color: white;
    width: 100%;
  }

  .mdl-dialog__actions {
    padding: 0;
  }

  .mdl-dialog__actions--full-width>* {
    padding-left: 16px;
    margin-left: 0;
    text-align: left
  }
</style>