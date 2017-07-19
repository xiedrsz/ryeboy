<template>
  <div class="page"
       title="功课管理">
    <div class="page-content">
      <div class="difficulty-container">
        <div class="title-row">
          <div style="font-weight: bold">更换难度</div>
          <div class="mdl-layout-spacer"></div>
          <div class="hint">难度越大效果越好</div>
        </div>
        <div class="difficulty-list"
             style="margin-top: 8px">
          <div class="difficulty-select"
               v-for="group in difficulties">
            <div class="groupname">{{ getGroupName(group.id) }}</div>
            <selectfield v-model="selectedDifficulties[group.id]"
                         :id="'_' + group.id"
                         :options="group.options"
                         :changed="difficultyChange" />
          </div>
        </div>
      </div>
      <div class="switch-container">
        <div class="title-row">
          <div style="font-weight: bold">开启功课</div>
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
                  <checkbox v-model="card.selected"
                            :id="card.id"
                            :disabled="userlv < card.unlock"
                            :text="card.group ? getGroupName(card.group) : card.name"
                            :changed="lessonChanged"></checkbox>
                </div>
                <div class="card-unlock"
                     v-if="userlv < card.unlock">
                  {{ getUnlockText(card.unlock) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    components: {
      "checkbox": require("ui/checkbox.vue"),
      "selectfield": require("ui/selectfield.vue")
    },
    data() {
      return {
        difficulties: [],
        lessons: []
      };
    },
    computed: {
      userid() {
        return this.$store.state.user._id;
      },
      userlv() {
        return this.$store.state.user.grade.lv;
      },
      selectedDifficulties() {
        return this.$store.state.lesson.difficulties;
      }
    },
    methods: {
      difficultyChange(data) {
        data.id = Number(data.id.slice(1));
        this.$store.commit("lesson_setDifficulty", data);
      },
      lessonChanged(data) {
        this.$store.commit("lesson_setDeselect", data);
      },
      save() {
        this.$store.dispatch("lesson_saveSettings");
      },
      finish() {
        history.go(-1);
      },
      getUnlockText(value) {
        return `[${value}级]`;
      },
      getGroupName(group) {
        return this.$app.textHelper.getLessonGroupName(group);
      }
    },
    beforeDestroy() {
      this.save();
    },
    mounted() {
      this.$app.toolbars.create([{
        text: "完成",
        click: this.finish
      }]);

      this.difficulties = this.$store.getters.lesson_getDifficultCards;
      this.lessons = this.$store.getters.lesson_getManagedCards;
    }
  };
</script>

<style lang="scss"
       scoped>
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
    margin-bottom: 8px;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    width: 160px;
  }

  .card-unlock {
    color: $color-secondary-text;
    font-size: 12px;
    @include flex-row;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
  }
</style>