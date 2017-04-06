<template>
  <div class="pull-to-refresh-material__control">
    <i class="material-icons pull-to-refresh-material__icon md-20 mdl-color-text--blue">refresh</i>
    <spinner class="pull-to-refresh-material__spinner" />
  </div>
</template>

<script>

const animates = {
  pulling(d, opts) {
    if (!opts.elControl) opts.elControl = opts.container.querySelector(".pull-to-refresh-material__control");

    const {
      threshold,
      elControl
    } = opts;

    let p = d / threshold;
    if (p > 1) p = 1;
    else p = p * p * p;
    elControl.style.opacity = p;
    elControl.style.transform = `translate3d(-50%, ${d / 2.5}px, 0) rotate(${360 * p}deg)`;
  },

  refreshing({
    elControl,
    threshold
  }) {
    elControl.style.transition = "transform 0.2s";
    elControl.style.transform = `translate3d(-50%, ${threshold / 2.5}px, 0)`;
  },

  aborting({
    elControl
  }) {
    return new Promise(resolve => {
      elControl.style.transition = "transform 0.3s, opacity 0.15s";
      elControl.style.transform = "translate3d(-50%, 0, 0)";
      elControl.style.opacity = 0;
      elControl.addEventListener("transitionend", () => {
        elControl.style.transition = "";
        resolve();
      });
    });
  },

  restoring({
    elControl
  }) {
    return new Promise(resolve => {
      elControl.style.transition = "transform 0.3s";
      elControl.style.transform += " scale(0.01)";
      elControl.addEventListener("transitionend", () => {
        elControl.style.transition = "";
        resolve();
      });
    });
  }
};

function ontouchpan({
  element,
  instance,
  onpanstart,
  onpanmove,
  onpanend
}) {
  let touchId, startX, startY, panstartCalled, isScrolling;

  function calcMovement(e) {
    if (instance.freeze) return false;

    const touch = Array.prototype.slice.call(e.changedTouches).filter(touch => touch.identifier === touchId)[0];
    if (!touch) return false;

    e.deltaX = touch.screenX - startX;
    e.deltaY = touch.screenY - startY;

    if (typeof isScrolling == "undefined") {
      isScrolling = !!(isScrolling || Math.abs(e.deltaY) < Math.abs(e.deltaX));
    }
    return !isScrolling;
  }

  function touchstart(e) {
    const touch = e.changedTouches[0];
    touchId = touch.identifier;
    startX = touch.screenX;
    startY = touch.screenY;
    isScrolling = undefined;
  }

  function touchmove(e) {
    if (calcMovement(e)) {
      if (onpanstart && !panstartCalled) {
        onpanstart(e);
        panstartCalled = true;
      }

      onpanmove(e);
    }
  }

  function touchend(e) {
    if (calcMovement(e)) onpanend(e);
  }

  element.addEventListener("touchstart", touchstart);
  if (onpanmove) element.addEventListener("touchmove", touchmove);
  if (onpanend) element.addEventListener("touchend", touchend);

  return function () {
    element.removeEventListener("touchstart", touchstart);
    if (onpanmove) element.removeEventListener("touchmove", touchmove);
    if (onpanend) element.removeEventListener("touchend", touchend);
  };
}

function pullToRefresh(opts) {
  opts = Object.assign({
    scrollable: document.body,
    threshold: 200,
    onStateChange() { /* noop */ }
  }, opts);

  const {
    container,
    scrollable,
    threshold,
    refresh,
    onStateChange,
    animates,
    instance
  } = opts;

  let distance, offset, state; // state: pulling, aborting, reached, refreshing, restoring

  function addClass(cls) {
    container.classList.add("pull-to-refresh--" + cls);
  }

  function removeClass(cls) {
    container.classList.remove("pull-to-refresh--" + cls);
  }

  return ontouchpan({
    element: container,
    instance,

    onpanmove(e) {
      let d = e.deltaY;

      if (scrollable.scrollTop > 0 || d < 0 && !state || state in {
        aborting: 1,
        refreshing: 1,
        restoring: 1
      }) return;

      e.preventDefault();

      if (distance == null) {
        offset = d;
        state = "pulling";
        addClass(state);
        onStateChange(state, opts);
      }

      d = d - offset;
      if (d < 0) d = 0;
      distance = d;

      if (d >= threshold && state !== "reached" || d < threshold && state !== "pulling") {
        removeClass(state);
        state = state === "reached" ? "pulling" : "reached";
        addClass(state);
        onStateChange(state, opts);
      }

      animates.pulling(d, opts);
    },

    onpanend() {
      if (state == null) return;

      if (state === "pulling") {
        removeClass(state);
        state = "aborting";
        onStateChange(state);
        addClass(state);
        animates.aborting(opts).then(() => {
          removeClass(state);
          distance = state = offset = null;
          onStateChange(state);
        });
      } else if (state === "reached") {
        removeClass(state);
        state = "refreshing";
        addClass(state);
        onStateChange(state, opts);
        animates.refreshing(opts);

        refresh().then(() => {
          removeClass(state);
          state = "restoring";
          addClass(state);
          onStateChange(state);

          animates.restoring(opts).then(() => {
            removeClass(state);
            distance = state = offset = null;
            onStateChange(state);
          });
        });
      }
    }
  });
}

export default {
  props: {
    disabled: Boolean
  },
  computed: {
    freeze() {
      return this.disabled;
    }
  },
  components: {
    "spinner": require("ui/spinner.vue")
  },
  mounted() {
    let self = this;
    pullToRefresh({
      instance: self,
      container: this.$el.parentNode,
      scrollable: this.$el.parentNode,
      animates,

      refresh() {
        return new Promise(resolve => {
          self.$emit("pulltorefresh");
          resolve();
        });
      }
    });
  }
};

</script>

<style scoped>
.pull-to-refresh-material__control {
  position: absolute;
  top: -50px;
  left: 50%;
  -webkit-transform: translate3d(-50%, 0, 0);
  transform: translate3d(-50%, 0, 0);
  width: 40px;
  height: 40px;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background: white;
  border-radius: 50%;
  z-index: 10001;
  box-shadow: 0 1px 6px rgba(0, 0, 0, .117647), 0 1px 4px rgba(0, 0, 0, .117647);
  display: none;
}

.pull-to-refresh--pulling .pull-to-refresh-material__control,
.pull-to-refresh--aborting .pull-to-refresh-material__control,
.pull-to-refresh--reached .pull-to-refresh-material__control,
.pull-to-refresh--refreshing .pull-to-refresh-material__control,
.pull-to-refresh--restoring .pull-to-refresh-material__control {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.pull-to-refresh--pulling .pull-to-refresh-material__spinner,
.pull-to-refresh--aborting .pull-to-refresh-material__spinner,
.pull-to-refresh--reached .pull-to-refresh-material__spinner,
.pull-to-refresh--refreshing .pull-to-refresh-material__icon,
.pull-to-refresh--restoring .pull-to-refresh-material__icon {
  display: none;
}

.pull-to-refresh-material__spinner {
  -webkit-transform-origin: center center;
  transform-origin: center center;
  -webkit-animation: pull-to-refresh-material-rotate 2s linear infinite;
  animation: pull-to-refresh-material-rotate 2s linear infinite;
}
</style>