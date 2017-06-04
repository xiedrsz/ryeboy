<template>
  <div class="page"
       title="写日记"
       :actions="actions">
    <div class="page-content">
      <div class="input-date">{{ dateText }}</div>
      <div class="input-hint">{{ isSunday ? "周日的内容为上一周总结，上传的真人照将做为每周封面。" : "记录当天的进步并肯定自己。" }}</div>
      <div class="input-container">
        <textarea class="input-box"
                  type="text"
                  :disabled="published"
                  rows="8"></textarea>
      </div>
      <div class="actions-container">
        <div class="action">插入图片</div>
        <div class="action">添加标签</div>
      </div>
    </div>
  </div>
</template>

<script>
  const moment = require("moment");

  export default {
    data() {
      return {
        record: {}
      };
    },
    methods: {
      init() {

      },
      save() {
        let content = this.$el.getElementsByClassName("input-box")[0].value;
        this.$store.commit("lesson_setDiary", content);
      },
      finish() {
        history.go(-1);
      }
    },
    computed: {
      actions() {
        return JSON.stringify([{
          text: "完成",
          clickHandler: "finish"
        }]);
      },
      dateText() {
        return moment(this.selectedDate).format("M[月]D[日]");
      },
      isSunday() {
        return moment(this.selectedDate).day() == 0;
      },
      published() {
        return this.record.published;
      },
      selectedDate() {
        return this.$store.state.lesson.selectedDate;
      },
    },
    beforeDestroy() {
      this.$off("finish");
      if (this.published) {
        return;
      }
      this.save();
    },
    mounted() {
      this.$on("finish", this.finish);

      this.$store.dispatch("lesson_assignRecord").then(res => {
        this.record = res;
        this.$el.getElementsByClassName("input-box")[0].value = this.record.diary.text;
        document.querySelector("textarea").focus();
      });
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .input-box {
    width: 100%;
    outline: none;
    resize: none;
    border: 1px solid #efefef;
    padding: 8px;
    color: $color-text;
  }

  .input-container {
    width: 90%;
    margin-top: 16px;
  }

  .input-date,
  .input-hint {
    color: $color-secondary-text;
  }

  .actions-container {
    @include flex-row;
    color: $color-blue;
    font-size: 12px;
    margin-top: 16px;
    -webkit-justify-content: flex-end;
    -ms-flex-pack: flex-end;
    justify-content: flex-end;
    margin-right: 16px;
  }

  .action {
    margin-left: 16px;
  }
</style>