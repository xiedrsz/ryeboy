<template>
  <div class="mdl-dialog-container">
    <div class="mdl-dialog">
      <h4 v-show="enableTitle"
          class="mdl-dialog__title">{{ title }}</h4>
      <div class="mdl-dialog__content">
        <p>
          {{ content }}
        </p>
      </div>
      <div class="mdl-dialog__actions">
        <button type="button"
                class="mdl-button ok"
                @click="ok">确定</button>
        <button v-show="enableCancel"
                type="button"
                class="mdl-button cancel"
                @click="cancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: "alert"
      },
      title: {
        type: String,
        default: ""
      },
      content: {
        type: String,
        default: ""
      },
    },
    computed: {
      enableTitle() {
        if (this.type == "alert" || this.type == "prompt") {
          return false;
        }

        return true;
      },
      enableCancel() {
        if (this.type == "alert") {
          return false;
        }

        return true;
      }
    },
    methods: {
      cancel() {
        this.$store.commit("page_showDialog", {
          show: false
        });
        this.$emit("cancel");
      },
      ok() {
        this.$store.commit("page_showDialog", {
          show: false
        });
        this.$emit("ok");
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
    align-items: center;
    top: 0;
    left: 0;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.3);
  }

  .mdl-dialog-container .mdl-dialog {
    background-color: white;
    padding: 8px;
  }

  .mdl-dialog__title {
    font-size: 2.0rem
  }
</style>