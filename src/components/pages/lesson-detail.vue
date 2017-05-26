<template>
  <div class="page"
       title="功课详情">
    <div class="content-top content-block">
      <img class="card-icon"
           :src="'../img/card-' + card.id + '.png'">
      <div class="card-description">
        <div class="card-name">{{ card.name }}</div>
        <!--<div class="card-value">{{ card.value }}</div>-->
      </div>
    </div>
    <div class="content-main">
      <div class="tab-header-container">
        <div v-for="tab in tabs"
             :id="tab.id"
             @click="switchTab"
             :class="{ active: tab.active }"
             class="tab-header">
          {{ tab.text }}
        </div>
      </div>
      <swipe @slidechanged="slideChanged"
             ref="swipe">
        <swipe-slide v-for="tab in tabs"
                     :id="tab.id">
          <div class="slide-content">
            <div class="html-content"
                 v-html="tab.content"></div>
          </div>
        </swipe-slide>
      </swipe>
    </div>
  </div>
</template>

<script>
  import api from "api";
  import textHelper from "js/utils/textHelper.js";

  export default {
    data() {
      return {
        activatedTab: 0,
        tabs: [{
          id: "tutorial",
          text: "功课教程",
          content: "",
          active: true
        }, {
          id: "faq",
          text: "常见问答",
          content: "",
          active: false
        }]
      };
    },
    methods: {
      slideChanged(index) {
        this.tabs[this.activatedTab].active = false;
        this.activatedTab = index;
        this.tabs[this.activatedTab].active = true;
      },
      switchTab(event) {
        let id = event.target.id;
        let index = this.tabs.findIndex(item => item.id == id);
        this.$refs.swipe.slideTo(index);
      },
    },
    components: {
      "swipe": require("ui/swipe.vue"),
      "swipe-slide": require("ui/swipe-slide.vue"),
    },
    computed: {
      card() {
        return this.$store.state.lesson.cards.find(card => card.id == this.$route.query.id);
      }
    },
    mounted() {
      api.getLessonDetail(String(this.card.id)).then(res => {
        this.tabs.find(item => {
          return item.id == "tutorial";
        }).content = res.data.tutorial;
        this.tabs.find(item => {
          return item.id == "faq";
        }).content = textHelper.escape(res.data.faq);
      });

      let slideContentHeight = (document.querySelector("main").clientHeight -
        document.querySelector(".content-top").clientHeight -
        document.querySelector(".tab-header-container").clientHeight - 1) + "px";
      document.querySelectorAll(".slide-content").forEach(item => {
        item.style.height = slideContentHeight;
      });
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .slide-content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .html-content {
    padding: 16px;
  }

  .tab-header-container {
    height: 36px;
    min-height: 36px;
    @include flex-row;
    @include flex-vertical-center;
    border-bottom: 1px solid $color-divider;
    background-color: $color-hint-block;
  }

  .tab-header {
    margin-left: 16px;
  }

  .tab-header.active {
    color: $color-blue;
  }

  .content-top {
    @include flex-row;
  }

  .card-description {
    @include flex-column;
    margin-left: 8px;
  }

  .card-name {
    color: $color-blue;
    font-size: 16px;
  }

  .card-value {
    margin-top: 8px;
  }

  .card-icon {
    width: 48px;
    height: 48px;
    border: 1px solid $color-disable;
    border-radius: 4px 2px 2px 2px;
    background-color: $color-divider;
  }
</style>