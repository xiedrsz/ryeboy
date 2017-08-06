<template>
  <div class="page"
       title="功课详情">
    <div class="content-top content-block">
      <div>
        <img class="card-icon"
             :src="require('img/card-' + card.id + '.png')">
        <div class="card-lv"
             v-if="userCard">
          <i v-for="(rate, index) in rates"
             :key="index"
             class="material-icons md-14">grade</i>
        </div>
      </div>
      <div class="card-description">
        <div class="card-name">{{ card.name }}</div>
        <div class="card-value"
             v-if="progress">{{ progress }}</div>
      </div>
    </div>
    <div class="content-main">
      <div class="tab-header-container">
        <div v-for="tab in tabs"
             :key="tab.id"
             @click="switchTab(tab.id)"
             :class="{ active: tab.active }"
             class="tab-header">
          {{ tab.text }}
        </div>
      </div>
      <swipe @slidechanged="slideChanged"
             ref="swipe">
        <swipe-slide v-for="tab in tabs"
                     :key="tab.id">
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
  import _ from "lodash";

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
      switchTab(id) {
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
      },
      userCard() {
        let user = this.$store.state.user;
        if (user.cards) {
          return user.cards[this.$route.query.id];
        } else {
          return null;
        }
      },
      rates() {
        if (this.userCard && this.userCard.lv > 1) {
          return _.fill(Array(this.userCard.lv - 1), 0);
        } else {
          return [];
        }
      },
      progress() {
        if (!this.userCard) return null;
        let progress = this.card.progress || [3, 7, 20, 60, 120];
        return `完成${ this.userCard.exp }天，还差${ progress[this.userCard.lv - 1] - this.userCard.exp }天升级`;
      }
    },
    mounted() {
      api.getLessonDetail(String(this.card.id)).then(res => {
        this.tabs.find(item => {
          return item.id == "tutorial";
        }).content = res.data.tutorial;
        this.tabs.find(item => {
          return item.id == "faq";
        }).content = this.$app.textHelper.escape(res.data.faq);
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
    color: $color-hint-text;
    font-size: 12px;
  }

  .card-icon {
    width: 48px;
    height: 48px;
    border: 1px solid $color-disable;
    border-radius: 4px 2px 2px 2px;
    background-color: $color-divider;
  }

  .card-lv {
    color: $color-orange;
    margin-top: -7px;
    text-align: center;
  }

  .card-lv i {
    margin-left: -5px;
  }
</style>