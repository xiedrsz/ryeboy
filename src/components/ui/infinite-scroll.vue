<template>
  <div>
    <div class="infinite-loading-container"
         v-show="loadstate == 'loading'">
      <spinner></spinner>
    </div>
    <div class="infinite-status-prompt"
         v-show="loadstate == 'loaded'">
      <slot name="nomore"></slot>
    </div>
    <div class="infinite-status-prompt"
         v-show="loadstate == 'error'">
      <slot name="error"></slot>
    </div>
  </div>
</template>

<script>
  function getScrollParent(elm) {
    if (!elm) {
      return null;
    }
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
        loadstate: "unload",
        disabled: false,
        initialized: false
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
      this.init();
    },
    methods: {
      init() {
        this.scrollParent = getScrollParent(this.$el);

        if (!this.scrollParent) {
          return;
        }

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
        this.$on("$InfiniteScroll:error", () => {
          this.loadstate = "error";
          this.scrollParent.removeEventListener("scroll", this.scrollHandler);
        });
        this.$on("$InfiniteScroll:reset", () => {
          this.loadstate = "unload";
          this.scrollParent.addEventListener("scroll", this.scrollHandler);
          setTimeout(this.scrollHandler, 1);
        });

        this.initialized = true;
      },
      attemptLoad() {
        if (this.disabled) {
          return;
        }
        const currentDistance = getCurrentDistance.bind(this)(this.scrollParent);
        if (this.loadstate != "loaded" && currentDistance <= this.distance) {
          this.loadstate = "loading";
          this.onInfinite(this);
        } else {
          this.loadstate = "unload";
        }
      },
    },
    deactivated() {
      this.disabled = true;
    },
    activated() {
      if (!this.initialized) {
        this.init();
      }

      this.disabled = false;
      this.attemptLoad();
    },
    destroyed() {
      if (this.loadstate != "loaded") {
        this.scrollParent.removeEventListener("scroll", this.scrollHandler);
      }
    },
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .infinite-loading-container,
  .infinite-status-prompt {
    @include flex-row;
    @include flex-center;
    margin-bottom: 32px;
    color: $color-hint-text;
  }
</style>