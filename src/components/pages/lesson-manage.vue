<template>
  <div class="page"
       title="功课管理">
    <div class="page-content">
      <div class="difficulty-container">
        <div class="title-row">
          <div>更换难度</div>
          <div class="mdl-layout-spacer"></div>
          <div class="hint">难度越大效果越好</div>
        </div>
        <div class="difficulty-list"
             style="margin-top: 8px">
          <div class="difficulty-select"
               v-for="options in difficulties">
            <div class="groupname">{{ getGroupName(options[0].group) }}</div>
            <multiselect v-model="selectedDifficulty[options[0].group]"
                         track-by="id"
                         label="name"
                         :allowEmpty="false"
                         :searchable="false"
                         :showLabels="false"
                         :options="options">
            </multiselect>
          </div>
        </div>
      </div>
      <div class="switch-container">
        <div class="title-row">
          <div>开启功课</div>
          <div class="mdl-layout-spacer"></div>
        </div>
        <div class="card-container">
          <div v-for="weight in lessons"
               class="weight-container">
            <div class="weight-block">
              <div class="weight-text">{{ weight.name }}</div>
            </div>
            <div class="card-list">
              <div v-for="card in weight.cards"
                   class="card">
                <div style="margin-right: 8px">
                  <checkbox :id="card.id"
                            :text="card.name"
                            :selected="card.selected"></checkbox>
                </div>
                <div class="card-unlock">
                  {{ getUnlockText(card.unlock) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  // import api from "api";
  import _ from "lodash";
  import Multiselect from "vue-multiselect";

  export default {
    components: {
      "checkbox": require("ui/checkbox.vue"),
      Multiselect
    },
    data() {
      return {
        selectedDifficulty: {},
        difficulties: [],
        selectedLessons: [],
        lessons: []
      };
    },
    methods: {
      getUnlockText(value) {
        return `[${value}级]`;
      },
      getGroupName(group) {
        switch (group) {
          case 304:
            return "麦式运动";

          case 401:
            return "早睡";

          case 411:
            return "早起";
        }
      }
    },
    mounted() {
      let cards = this.$store.getters.lesson_getCards;
      let lessons = {};
      let selectedDifficulties = this.$store.state.lesson.selectedDifficulties;

      cards.forEach(card => {
        if (card.group) {
          if (!lessons[card.group]) {
            lessons[card.group] = [];
          }
          lessons[card.group].push(card);
          if (selectedDifficulties[card.group] && selectedDifficulties[card.group] == card.id) {
            this.selectedDifficulty[card.group] = card;
          }
        }
      });

      _.each(lessons, item => {
        this.difficulties.push(item);
      });

      this.lessons = this.$store.getters.lesson_getOptionalCards;
    }
  };
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss"
       scoped>
  @import "~css/vue-multiselect-overlay.css";
  @import "~scss/main.scss";
  .title-row {
    @include flex-row;
    width: 100%;
  }

  .hint {
    color: $color-hint-text;
    font-size: 12px;
  }

  .difficulty-select {
    margin-top: 8px;
    @include flex-row;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .difficulty-list {
    @include flex-column;
    width: 100%;
  }

  .groupname {
    width: 96px;
    color: $color-secondary-text;
  }

  .switch-container {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid $color-divider;
  }

  .weight-block {
    @include flex-row;
    padding: 16px 0;
    color: $color-secondary-text;
  }

  .weight-text {
    color: $color-blue;
    font-size: 12px;
  }

  .card-list {
    @include flex-row;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
  }

  .card {
    @include flex-row;
    margin-bottom: 16px;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .card-unlock {
    color: $color-hint-text;
    font-size: 12px;
    margin-right: 24px;
    @include flex-row;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
  }
</style>