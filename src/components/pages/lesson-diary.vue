<template>
  <div class="page"
       title="写日记">
    <div class="page-content">
      <div class="input-date">{{ dateText }}</div>
      <div class="input-hint">{{ isSunday ? "周日的内容为上一周总结，上传的真人照将做为每周封面。" : "记录当天的进步并肯定自己。" }}</div>
      <div class="input-container">
        <textarea class="input-box"
                  type="text"
                  :disabled="published"
                  rows="8"></textarea>
      </div>
      <div class="actions-container"
           v-show="!published">
        <div class="action"
             @click="insertPicture">插入图片</div>
        <div class="action"
             @click="addLabels">添加标签</div>
      </div>
      <div class="picture-container"
           v-if="pictures.length > 0">
        <div class="note">已插入图片</div>
        <div class="picture-block">
          <div v-for="picture in pictures"
               :key="picture.id"
               class="inserted-picture-wrap">
            <img :src="picture.url ? picture.url: picture.path"
                 @click.stop="showPicture"
                 class="inserted-picture">
            <i class="material-icons md-18 remove-picture"
               v-show="!published"
               @click="removePicture(picture.id)">clear</i>
          </div>
        </div>
      </div>
      <div class="label-container"
           v-if="labels.length > 0">
        <div class="note">已添加标签</div>
        <div class="label-block">
          <div v-for="item in labels"
               class="label"
               :key="item.name">
            {{ item.displayName }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const moment = require("moment");
  import _ from "lodash";

  export default {
    data() {
      return {
        record: {
          diary: {
            pictures: []
          }
        }
      };
    },
    methods: {
      showPicture() {},
      removePicture(id) {
        let index = _.findIndex(this.pictures, item => {
          return item.id == id;
        });
        this.pictures.splice(index, 1);
      },
      addLabels() {
        this.$router.push("/pages/lesson-add-labels");
      },
      async insertPicture() {
        if (this.pictures.length >= 3) {
          this.$app.dialog.text("只能插入3张图片。");
          return;
        }

        if (this.$app.deviceready) {
          let imageUri = await this.$app.selectPicture();
          this.pictures.push({
            id: _.uniqueId(_.now()),
            path: imageUri
          });
        } else {
          // this.pictures.push({
          //   id: _.uniqueId(_.now()),
          //   path: "img/default-avatar.png"
          // });
          this.$app.dialog.text("PC端暂未开放该功能。");
        }
      },
      init() {

      },
      save() {
        let content = this.$el.getElementsByClassName("input-box")[0].value;
        this.$store.commit("lesson_setDiary", {
          text: content,
          pictures: this.pictures
        });
      },
      finish() {
        history.go(-1);
      }
    },
    computed: {
      pictures() {
        return this.record.diary.pictures;
      },
      labels() {
        let selectedLabels = this.record.diary.labels;
        let labels = this.$store.state.lesson.labels;

        if (_.isEmpty(selectedLabels) || _.isEmpty(labels)) {
          return [];
        }

        let r = [];
        selectedLabels.forEach(name => {
          if (labels[name]) {
            r.push({
              name,
              displayName: labels[name].displayName
            });
          }
        });
        return r;
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
      if (this.published) {
        return;
      }
      this.save();
    },
    activated() {
      this.$app.toolbars.create([{
        text: "完成",
        click: this.finish
      }]);
    },
    mounted() {
      this.$store.dispatch("lesson_getRecord").then(res => {
        this.record = res;
        this.$el.getElementsByClassName("input-box")[0].value = this.record.diary.text;
        // document.querySelector("textarea").focus();
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

  .inserted-picture {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }

  .picture-container {
    margin-top: 16px;
    padding-top: 8px;
    border-top: 1px solid $color-divider;
  }

  .picture-block {
    @include flex-row;
  }

  .inserted-picture-wrap {
    position: relative;
    padding-top: 8px;
    padding-right: 3px;
  }

  .remove-picture {
    top: 0;
    right: 2px;
    position: absolute;
    background-color: white;
    opacity: 0.8;
    color: $color-secondary-text;
  }

  .label-container {
    margin-top: 16px;
    padding-top: 8px;
    border-top: 1px solid $color-divider;
  }

  .label-block {
    @include flex-row;
    margin-top: 8px;
  }

  .label {
    @include flex-row;
    @include flex-center;
    font-size: 12px;
    position: relative;
    width: 56px;
    border-radius: 4px;
    border: 1px solid $color-hint-text;
    color: $color-text;
    margin-right: 8px;
    margin-bottom: 8px;
  }

  .note {
    font-size: 12px;
    color: $color-hint-text;
  }
</style>