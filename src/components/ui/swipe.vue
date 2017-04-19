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
  methods: {
    slideTo(index) {
      this.swipe.slide(index, 1);
    },
    setup() {
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
    reset() {
      if (this.swipe) {
        this.swipe.kill();
        delete this.swipe;
      }
      this.setup();
    }
  },
  mounted: function () {
    this.setup();
  },
  beforeDestroy() {
    if (this.swipe) {
      this.swipe.kill();
      delete this.swipe;
    }
  }
};
</script>