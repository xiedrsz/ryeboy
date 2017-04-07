<template>
  <div class="infinite-loading-container">
    <div v-show="loadstate == 'loading'">
      <spinner />
    </div>
    <div class="infinite-status-prompt"
         v-show="loadstate == 'loaded'">
      <slot name="no-more"></slot>
    </div>
  </div>
</template>

<script>
function getScrollParent(elm) {
  if (elm.tagName === "BODY") {
    return window;
  } else if (["scroll", "auto"].indexOf(getComputedStyle(elm).overflowY) > -1) {
    return elm;
  }
  return getScrollParent(elm.parentNode);
}

function getCurrentDistance(elm) {
  let distance;
  const scrollTop = isNaN(elm.scrollTop) ? elm.pageYOffset : elm.scrollTop;
  const scrollElmHeight = elm === window ?
    window.innerHeight :
    elm.getBoundingClientRect().height;

  distance = this.$el.offsetTop - scrollTop - scrollElmHeight - (elm.offsetTop || 0);
  return distance;
}

export default {
  components: {
    "spinner": require("ui/spinner.vue")
  },
  data() {
    return {
      scrollParent: null,
      scrollHandler: null,
      loadstate: "unload"
    };
  },
  props: {
    distance: {
      type: Number,
      default: 100,
    },
    onInfinite: Function
  },
  mounted() {
    this.scrollParent = getScrollParent(this.$el);

    this.scrollHandler = function scrollHandlerOriginal() {
      if (this.loadstate != "loading") {
        this.attemptLoad();
      }
    }.bind(this);

    setTimeout(this.scrollHandler, 1);
    this.scrollParent.addEventListener("scroll", this.scrollHandler);

    this.$on("$InfiniteScroll:loaded", () => {
      if (this.loadstate == "loading") {
        this.$nextTick(this.attemptLoad);
      }
    });
    this.$on("$InfiniteScroll:complete", () => {
      this.loadstate = "loaded";
      this.scrollParent.removeEventListener("scroll", this.scrollHandler);
    });
    this.$on("$InfiniteScroll:reset", () => {
      this.loadstate = "unload";
      this.scrollParent.addEventListener("scroll", this.scrollHandler);
      setTimeout(this.scrollHandler, 1);
    });
  },
  methods: {
    attemptLoad() {
      const currentDistance = getCurrentDistance.bind(this)(this.scrollParent);
      if (this.loadstate != "loaded" && currentDistance <= this.distance) {
        this.loadstate = "loading";
        this.onInfinite(this);
      } else {
        this.loadstate = "unload";
      }
    },
  },
  destroyed() {
    if (this.loadstate != "loaded") {
      this.scrollParent.removeEventListener("scroll", this.scrollHandler);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~scss/main.scss";
.infinite-loading-container, .infinite-status-prompt {
  @include flex-row;
  @include flex-center;
  height: 48px;
  color: $color-hint-text;
}
</style>