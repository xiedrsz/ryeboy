<template>
  <!-- Root element of PhotoSwipe. Must have class pswp. -->
  <div class="pswp"
       tabindex="-1"
       role="dialog"
       aria-hidden="true">

    <!-- Background of PhotoSwipe. 
         It's a separate element as animating opacity is faster than rgba(). -->
    <div class="pswp__bg"></div>

    <!-- Slides wrapper with overflow:hidden. -->
    <div class="pswp__scroll-wrap">

      <!-- Container that holds slides. 
            PhotoSwipe keeps only 3 of them in the DOM to save memory.
            Don't modify these 3 pswp__item elements, data is added later on. -->
      <div class="pswp__container">
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
      </div>

      <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
      <div class="pswp__ui pswp__ui--hidden">

        <div class="pswp__top-bar">

          <!--  Controls are self-explanatory. Order can be changed. -->

          <div class="pswp__counter"></div>

          <button class="pswp__button pswp__button--close"
                  title="Close (Esc)"></button>

          <button class="pswp__button pswp__button--share"
                  title="Share"></button>

          <button class="pswp__button pswp__button--fs"
                  title="Toggle fullscreen"></button>

          <button class="pswp__button pswp__button--zoom"
                  title="Zoom in/out"></button>

          <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
          <!-- element will get class pswp__preloader--active when preloader is running -->
          <div class="pswp__preloader">
            <div class="pswp__preloader__icn">
              <div class="pswp__preloader__cut">
                <div class="pswp__preloader__donut"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
          <div class="pswp__share-tooltip"></div>
        </div>

        <button class="pswp__button pswp__button--arrow--left"
                title="Previous (arrow left)">
        </button>

        <button class="pswp__button pswp__button--arrow--right"
                title="Next (arrow right)">
        </button>

        <div class="pswp__caption">
          <div class="pswp__caption__center"></div>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
  import PhotoSwipe from "photoswipe/dist/photoswipe";
  import PhotoSwipeUI_Default from "photoswipe/dist/photoswipe-ui-default";

  export default {
    methods: {
      getSlideDimensions(slide) {
        if (!slide.doGetSlideDimensions) {
          return;
        }

        var image = new Image();
        image.addEventListener("error", () => {
          slide.doGetSlideDimensions = false;
        });
        image.addEventListener("load", () => {
          slide.doGetSlideDimensions = false;
          slide.w = image.naturalWidth;
          slide.h = image.naturalHeight;
          this.photoswipe.invalidateCurrItems();
          this.photoswipe.updateSize(true);
        });

        image.src = slide.src;
      },
      open(index, list, params = {
        captionEl: false,
        fullscreenEl: false,
        history: false,
        shareEl: false,
        tapToClose: false,
        pinchToClose: false,
        loop: false,
        showHideOpacity: true,
        showAnimationDuration: 0,
        hideAnimationDuration: 0,
        closeOnVerticalDrag: false,
        closeOnScroll: false,
        maxSpreadZoom : 2
      }) {
        let options = Object.assign({
          index: index
        }, params);
        options.getDoubleTapZoom = (isMouseClick, item) =>{
          if (isMouseClick) {
            return 1;
          } else {
            console.log(item);
            return item.initialZoomLevel <= 0.5 ? 1 : 2;
          }
        };
        this.photoswipe = new PhotoSwipe(this.$el, PhotoSwipeUI_Default, list, options);
        this.photoswipe.init();
        this.photoswipe.listen("gettingData", (index, slide) => {
          if (slide.doGetSlideDimensions) {
            setTimeout(() => {
              this.getSlideDimensions(slide);
            }, 300);
          }
        });
        this.photoswipe.listen("imageLoadComplete", (index, slide) => {
          if (slide.doGetSlideDimensions) {
            this.getSlideDimensions(slide);
          }
        });
        this.photoswipe.listen("close", () => {
          this.$store.commit("page_setPopup");
        });

        this.$store.commit("page_setPopup", this.photoswipe);
      },
      close() {
        this.photoswipe.close();
      }
    }
  };
</script>

<style>
  @import "~photoswipe/dist/photoswipe.css";
  @import "~photoswipe/dist/default-skin/default-skin.css";
</style>