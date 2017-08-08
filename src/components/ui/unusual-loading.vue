<template>
  <div>
    <div v-if="no" class="unload" @click="reload">
      (未加载)
    </div>
    <div v-else-if="!!err" class="loadstate" @click="reload">
      {{err === true ? '(加载错误,可点击重新加载)' : err }}
    </div>
    <div v-else-if="none" class="loadstate" @click="reload">
      (无内容)
    </div>
    <div v-else-if="icon" class="loadstate">
      <spinner />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      option: {
        type: Object,
        default () {
          return {
            no: false,
            err: false,
            none: false,
            icon: false
          }
        }
      }
    },
    methods: {
      reload() {
        this.$emit('reload')
      }
    },
    computed: {
      no() {
          return this.option.no;
        },
        err() {
          return this.option.err;
        },
        none() {
          return this.option.none;
        },
        icon() {
          return this.option.icon;
        }
    },
    components: {
      "spinner": require("ui/spinner.vue")
    },
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .loadstate {
    @include flex-row;
    @include flex-center;
    height: 128px;
  }
  
  .unload {
    @include flex-row;
    @include flex-center;
    height: 256px;
    color: $color-hint-text;
  }
</style>