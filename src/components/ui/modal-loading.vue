<template>
  <div class="mdl-dialog-container">
    <div class="mdl-dialog">
      <div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>
    </div>
  </div>
</template>

<style scoped>
  .mdl-dialog-container {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.3);
  }
  
  .mdl-dialog-container .mdl-dialog {
    background-color: white;
    padding: 8px;
    width: 48px;
    height: 48px;
    border-width: 1px;
    border-radius: 50%;
    min-width: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .mdl-spinner {
    width: 16px;
    height: 16px
  }
</style>