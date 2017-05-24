<template>
  <div class="page-layout">
    <div class="action-container">
      <div class="action date-selector"
           @click="selectDate">
        <span>{{ selectedDateText}}</span>
        <i class="material-icons md-20"
           style="margin-left: 8px"
           @click="selectDate">expand_more</i>
      </div>
      <div class="mdl-layout-spacer"></div>
      <div class="action"
           @click="$router.push('/pages/lesson-manage')">管理</div>
      <div class="action"
           @click="save">保存</div>
      <div class="action"
           :class="{ published: published }"
           @click="publish">{{ published ? "已发布": "发布" }}</div>
    </div>
    <div class="card-container">
      <div v-for="weight in cards"
           v-show="weight.cards.length > 0"
           class="weight-container">
        <div class="weight-block">
          <div class="weight-text">{{ weight.name }}</div>
          <div class="mdl-layout-spacer"></div>
          <div>
            <checkbox :id="weight.value"
                      v-model="record.selectedWeights[weight.value - 1]"
                      :disabled="published"
                      text="全选"
                      :changed="selectAllCards"></checkbox>
          </div>
        </div>
        <div class="card-list">
          <div v-for="card in weight.cards"
               class="card">
            <img class="card-icon"
                 @click="cardDetail(card.id)"
                 :src="'../../img/card-' + card.id + '.png'">
            <div class="card-name">{{ card.name }}</div>
            <checkbox :id="card.id"
                      :disabled="published"
                      :changed="selectCard"
                      v-model="record.selectedCards[card.id]"></checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const flatpickr = require("flatpickr");
  const datetime = require("js/utils/datetime");
  const moment = require("moment");
  const dialog = require("js/utils/dialog");

  export default {
    data() {
      return {
        record: {}
      };
    },
    methods: {
      assignRecord() {
        this.$store.dispatch("lesson_assignRecord").then(res => {
          this.record = res;
        });
      },
      save() {
        if (this.published) {
          return;
        }
        this.$store.dispatch("lesson_save");
        let dateText = moment(this.selectedDate).format("M[月]D[日]");

        dialog.text(`${dateText}的功课已保存在本地`);
      },
      publish() {
        if (this.published) {
          return;
        }
        this.$router.push("/pages/lesson-publish");
      },
      selectDate() {
        this.flatpickr.open();
      },
      cardDetail(cardId) {
        if (cardId == 100) {
          this.$router.push("/pages/lesson-diary");
        } else {
          this.$router.push(`/pages/lesson-detail?id=${cardId}`);
        }
      },
      cardVisibled(card) {
        return this.userlv >= card.unlock;
      },
      selectCard(data) {
        this.$store.dispatch("lesson_selectCard", data);
      },
      selectAllCards(data) {
        this.$store.dispatch("lesson_selectAllCards", data);
      }
    },
    computed: {
      selectedDateText() {
        let date = moment(this.selectedDate);
        let suffix = "";
        let diffDays = date.diff(datetime.date(moment()), "days");
        if (diffDays == -1) {
          suffix = "昨天";
        } else if (diffDays == 0) {
          suffix = "今天";
        } else
        if (diffDays == -2) {
          suffix = "前天";
        }
        return date.format("M[月]D[日]" + suffix);
      },
      selectedDate() {
        return this.$store.state.lesson.selectedDate;
      },
      published() {
        return this.record.published;
      },
      cards() {
        return this.record.weightedCards;
      }
    },
    mounted() {
      document.querySelector(".card-container").style.height = (document.querySelector("main").clientHeight - document.querySelector(".action-container").clientHeight - 1) + "px";
      let self = this;

      this.flatpickr = new flatpickr(document.querySelector(".date-selector"), {
        clickOpens: false,
        disableMobile: true,
        defaultDate: this.selectedDate,
        locale: require("flatpickr/dist/l10n/zh.js").zh,
        disable: [
          function(date) {
            return datetime.date(date).isAfter(datetime.date(moment()));
          }
        ],
        onChange(selectedDates) {
          self.$store.dispatch("lesson_selectDate", selectedDates[0]).then(res => {
            self.record = res;
          });
        }
      });
    },
    destroyed() {
      if (this.flatpickr) {
        this.flatpickr.destroy();
        delete this.flatpickr;
      }
    },
    activated() {
      this.assignRecord();
    },
    components: {
      "checkbox": require("ui/checkbox.vue"),
    }
  };
</script>

<style src="flatpickr/dist/themes/material_blue.css"></style>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .page-layout {
    @include flex-column;
    width: 100%;
  }

  .action-container {
    height: 36px;
    min-height: 36px;
    padding-left: 8px;
    padding-right: 8px;
    @include flex-row;
    border-bottom: 1px solid $color-divider;
    background-color: $color-hint-block;
  }

  .action {
    color: $color-secondary-text;
    text-decoration: none;
    display: table-cell;
    white-space: nowrap;
    padding-left: 8px;
    padding-right: 8px;
    text-align: left;
    line-height: 36px;
  }

  .card-container {
    @include flex-column;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .weight-container {
    padding-bottom: 16px;
    padding-top: 8px;
    border-bottom: 1px solid $color-divider;
  }

  .weight-block {
    @include flex-row;
    padding: 16px;
    color: $color-secondary-text;
  }

  .weight-text {
    color: $color-blue;
  }

  .card-list {
    @include flex-row;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
  }

  .published {
    color: $color-blue;
  }

  .card {
    @include flex-column;
    width: 64px;
    margin-bottom: 16px;
    padding-left: 16px;
  }

  .card-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px 4px 4px 4px;
    background-color: $color-disable;
  }

  .card-name {
    font-size: 12px;
  }

  .date-selector {
    @include flex-row;
    @include flex-vertical-center;
  }
</style>