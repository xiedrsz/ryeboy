<template>
  <div class="swipe">
    <div class="swipe-wrap">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "swipe",
  mounted: function () {
    let self = this;
    this.swipe = new Swipe(this.$el, {
      continuous: false,
      stopPropagation: true,
      transitionEnd(index) {
        if (index != this.activeIndex) {
          self.activeIndex = index;
          self.$emit("slidechanged", index);
        }
      }
    });
    this.activeIndex = this.swipe.getPos();
  },
  beforeDestroy() {
    if (this.swipe) {
      delete this.swipe;
    }
  }
};
</script>