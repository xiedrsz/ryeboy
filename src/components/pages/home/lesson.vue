<template>
  <div>
    <loadable-content class="page-layout"
                      v-if="authenticated"
                      :loadstate="loadstate">
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
             :class="{ disabled: published || expired }"
             @click="publish">{{ "发布" }}</div>
      </div>
      <div class="info-container">
        <div class="published"
             v-show="published || saved">{{ published ? "已发布" : saved ? "已保存" : "" }}</div>
        <div>{{ `完成${record.selectedCount}/${record.cardCount}项` }}</div>
        <div class="expired"
             v-show="expired && !published">不能发布超过一周的记录</div>
      </div>
      <div class="card-container">
        <div v-for="weight in cards"
             :key="weight.name"
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
                 :key="card.id"
                 class="card">
              <div class="card-icon"
                   @click="cardDetail(card.id)">
                <img :src="require('img/card-' + card.id + '.png')">
                <div class="card-lv">
                  <i v-for="(rate, index) in card.rates"
                     :key="index"
                     class="material-icons md-12">grade</i>
                </div>
              </div>
              <div class="card-name">{{ card.name }}</div>
              <checkbox :id="card.id"
                        :disabled="published"
                        :changed="selectCard"
                        v-model="record.selectedCards[card.id]"></checkbox>
            </div>
          </div>
        </div>
      </div>
    </loadable-content>
    <div class="page-layout unauthenticated"
         v-if="!authenticated">
      <div class="intro">
        功课是由麦式运动、饮食、睡眠、心理、生理等40多种健康习惯所组成的健康系统，帮助你培养良好的生活习惯，从而减轻和消除不良习惯及所导致的亚健康问题。登录后可查看详细的功课教程。
      </div>
      <div class="login-block">
        <button-flat text="登录"
                     :border="true"
                     @click.native="$app.login($route.fullPath)"></button-flat>
      </div>
    </div>
  </div>
</template>

<script>
  const flatpickr = require("flatpickr");
  const moment = require("moment");

  export default {
    data() {
      return {
        loadstate: "loading",
        record: {},
        initialized: false
      };
    },
    methods: {
      init() {
        this.$app.adjustScrollableElement(".card-container", [".action-container", ".info-container"]);
        let self = this;

        this.flatpickr = new flatpickr(document.querySelector(".date-selector"), {
          clickOpens: false,
          disableMobile: true,
          animate: false,
          defaultDate: this.selectedDate,
          locale: require("flatpickr/dist/l10n/zh.js").zh,
          disable: [
            function(date) {
              date = self.$app.datetime.date(date);
              let today = self.$app.datetime.date(moment());
              let expire = self.$app.datetime.date(moment().subtract(7, "days"));
              let d = moment(date).format("YYYYMMDD");
              return (date.isAfter(today) || date.isBefore(expire)) && !self.publishedDates.includes(d) && !self.savedDates.includes(d);
            }
          ],
          mark: function(date) {
            let d = moment(date).format("YYYYMMDD");
            return self.publishedDates.includes(d) || self.savedDates.includes(d);
          },
          onChange(selectedDates) {
            self.$app.dialog.showLoading();
            self.$store.dispatch("lesson_selectDate", selectedDates[0]).then(res => {
              self.record = res;
              self.$app.dialog.hideLoading();
            });
          },
          onClose() {
            self.$store.commit("page_setPopup");
          }
        });

        this.$on("closePopup", () => {
          self.flatpickr.close();
        });

        this.initialized = true;
      },
      save() {
        if (this.published) {
          return;
        }
        this.$store.dispatch("lesson_save");
        let dateText = moment(this.selectedDate).format("M[月]D[日]");

        this.$app.dialog.text(`提醒：${dateText}的功课记录已保存在本地，未发布前可以进行多次编辑。`);
      },
      publish() {
        if (this.published || this.expired) {
          return;
        }
        this.$router.push("/pages/lesson-publish");
      },
      selectDate() {
        this.$store.commit("page_setPopup", this.flatpickr);
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
        this.$store.commit("lesson_selectCard", data);
      },
      selectAllCards(data) {
        this.$store.commit("lesson_selectAllCards", data);
      }
    },
    computed: {
      selectedDateText() {
        let date = moment(this.selectedDate);
        let suffix = "";
        let diffDays = date.diff(this.$app.datetime.date(moment()), "days");
        if (diffDays == -1) {
          suffix = "昨天";
        } else if (diffDays == 0) {
          suffix = "今天";
        } else if (diffDays == -2) {
          suffix = "前天";
        } else {
          suffix = date.format("ddd");
        }
        return date.format("M[月]D[日]" + suffix);
      },
      selectedDate() {
        return this.$store.state.lesson.selectedDate;
      },
      published() {
        return this.record.published;
      },
      expired() {
        let expire = this.$app.datetime.date(moment().subtract(7, "days"));
        return moment(this.selectedDate).isBefore(expire);
      },
      authenticated() {
        return this.$store.state.user.authenticated;
      },
      cards() {
        return this.record.weightedCards;
      },
      savedDates() {
        return this.$store.state.lesson.savedDates;
      },
      saved() {
        return this.savedDates.includes(moment(this.selectedDate).format("YYYYMMDD"));
      }
    },
    beforeDestroy() {
      this.$off("closePopup");
    },
    destroyed() {
      if (this.flatpickr) {
        this.flatpickr.destroy();
        delete this.flatpickr;
      }
    },
    watch: {
      savedDates() {
        if (this.flatpickr) {
          this.flatpickr.redraw();
        }
      }
    },
    async activated() {
      if (!this.authenticated) {
        return;
      }

      if (this.initialized) {
        this.record = await this.$store.dispatch("lesson_getRecord");
      } else {
        // 获取发布了日记的日期
        let publishedDates = (await this.$app.api.getPublishedDates(this.$app.userid)).data;
        this.publishedDates = [];
        publishedDates.forEach(item => {
          this.publishedDates.push(moment(item.date).format("YYYYMMDD"));
        });

        // 获取本地保存了日记的日期
        await this.$store.dispatch("lesson_getSavedDates");

        // 获取用户的功课等级信息
        if (!this.$app.user.cards) {
          await this.$store.dispatch("user_getCards");
        }

        // 获取功课记录
        this.record = await this.$store.dispatch("lesson_getRecord");

        this.loadstate = "loaded";
        this.$nextTick(() => {
          this.init();
        });
      }
    },
    components: {
      "checkbox": require("ui/checkbox.vue"),
      "button-flat": require("ui/button-flat.vue"),
    }
  };
</script>

<style src="flatpickr/dist/flatpickr.css"></style>

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

  .info-container {
    @include flex-row;
    padding: 4px 16px;
    font-size: 12px;
    color: $color-secondary-text;
    border-bottom: 1px solid $color-divider;
  }

  .info-container div {
    margin-right: 8px;
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

  .disabled {
    color: $color-disable;
  }

  .card {
    @include flex-column;
    width: 64px;
    margin-bottom: 16px;
    padding-left: 16px;
  }

  .card-icon {
    width: 36px;
    height: 36px;
    border: 1px solid $color-disable;
    border-radius: 8px 4px 4px 4px;
    background-color: $color-divider;
    text-align: center;
  }

  .card-icon img {
    width: 32px;
    height: 32px;
    margin-top: 2px;
  }

  .card-lv {
    color: $color-orange;
    margin-top: -7px;
  }

  .card-lv i {
    margin-left: -5px;
  }

  .card-name {
    font-size: 12px;
  }

  .date-selector {
    @include flex-row;
    @include flex-vertical-center;
  }

  .unauthenticated {
    display: block;
    padding: 32px 16px;
    width: auto;
    font-size: 16px;
  }

  .published {
    color: $color-orange;
  }

  .expired {
    color: $color-red;
  }

  .login-block {
    text-align: center;
    margin-top: 64px;
  }
</style>