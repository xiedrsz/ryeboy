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
      <div class="actions-container">
        <div class="action"
             @click="insertPicture">插入图片</div>
        <div class="action">添加标签</div>
      </div>
      <div class="picture-container"
           v-if="pictures.length > 0">
        <div v-for="picture in pictures"
             class="inserted-picture-wrap"
             @click="removePicture(picture.id)"
             :data-badge="'×'">
          <img :src="picture.path"
               class="inserted-picture">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const moment = require("moment");
  import _ from "lodash";
  import app from "js/app";

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
      removePicture(id) {
        let index = _.findIndex(this.pictures, item => {
          return item.id == id;
        });
        console.log(index);
        this.pictures.splice(index, 1);
      },
      insertPicture() {
        if (this.pictures.length >= 3) {
          app.dialog.text("只能插入3张图片。");
          return;
        }

        if (app.deviceready) {
          // navigator.camera.getPicture(imageUri => {
          //   this.record.pictures.push(imageUri);
          //   console.log(imageUri);
          // }, error => {
          //   console.debug("Unable to obtain picture: " + error, "app");
          // }, {
          //   destinationType: Camera.DestinationType.FILE_URI,
          //   sourceType: Camera.PictureSourceType.pictureLIBRARY,
          //   mediaType: Camera.MediaType.PICTURE
          // });
        }

        this.pictures.push({
          id: _.uniqueId(),
          path: require("img/card-100.png")
        });
        this.pictures.push({
          id: _.uniqueId(),
          path: require("img/card-101.png")
        });
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
    mounted() {
      app.actions.show([{
        text: "完成",
        click: this.finish
      }]);

      this.$store.dispatch("lesson_assignRecord").then(res => {
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
    width: 64px;
    height: 64px;
    object-fit: cover;
    margin-right: 8px;
    border: 1px solid $color-disable;
  }

  .picture-container {
    @include flex-row;
    margin-top: 16px;
  }

  .inserted-picture-wrap {
    position: relative;
  }

  .inserted-picture-wrap[data-badge]:after {
    content: attr(data-badge);
    position: absolute;
    top: -11px;
    right: -1px;
    font-size: 1.2em;
    color: $color-blue;
    width: 16px;
    height: 16px;
  }
</style>