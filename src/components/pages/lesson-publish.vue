<template>
  <div class="page"
       title="发布功课">
    <div class="content-block">
      <div>发布{{ dateText }}的功课，发布后不能再修改，自己和小组分别增加升级经验，也让更多的人因你的分享而受益。</div>
      <div class="privacy-container">
        <div class="privacy-label">谁可以看</div>
        <div v-for="option in options"
             :key="option.id">
          <radio :id="option.id"
                 :text="option.text"
                 :value="option.value"
                 v-model="privacy"
                 name="privacy"></radio>
          <div class="privacy-description">{{ option.description }}</div>
        </div>
      </div>
      <div class="publish-container">
        <button-colored class="publish-button"
                        text="发布"
                        @click.native="publish">
        </button-colored>
      </div>

    </div>
  </div>
</template>

<script>
  const moment = require("moment");
  const _ = require("lodash");
  import api from "api";

  export default {
    data() {
      return {
        privacy: "0",
        options: [{
          id: "public",
          value: "0",
          text: "公开",
          description: "所有用户都可以看到。"
        }, {
          id: "service",
          value: "1",
          text: "仅义工可见",
          description: "只有通过“Ｖ”认证的麦田义工可以看到。"
        }, {
          id: "private",
          value: "2",
          text: "仅自己可见",
          description: "保存在“我的日记”内，只有自己可以看到。"
        }, {
          id: "group",
          value: "3",
          text: "仅组员可见",
          description: "只有同小组的组员可以看到。"
        }]
      };
    },
    methods: {
      async publish() {
        try {
          let data = await this.$store.dispatch("lesson_getPublishData");

          // 上传图片文件
          let pictures = [];
          let length = data.pictures ? data.pictures.length : 0;

          if (length > 0) {
            for (let index = 0; index < length; index++) {
              let picture = data.pictures[index];
              let filename = `${this.$app.userid}_${_.now()}`;

              await this.$app.uploadPicture(picture.path, filename, "pictures");
              let url = this.$app.textHelper.getPictureUrl(filename);
              this.$store.commit("lesson_setPictureUrl", {
                id: picture.id,
                url 
              });
              pictures.push(filename);
            }
          }

          // 提交数据
          data.pictures = pictures;
          data.privacy = Number(this.privacy);
          data.time = this.$app.datetime.utcDate(data.time);
          await api.publishLesson(data);
          await this.$store.dispatch("lesson_publish");
          history.go(-1);
        } catch (error) {
          console.log(error);
          this.$app.dialog.text("发布失败，可能是网络不给力。");
        }
      },
    },
    components: {
      "button-colored": require("components/ui/button-colored.vue"),
      "radio": require("components/ui/radio.vue"),
    },
    computed: {
      dateText() {
        return moment(this.selectedDate).format("M[月]D[日]");
      },
      selectedDate() {
        return this.$store.state.lesson.selectedDate;
      },
    },
    mounted() {}
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .privacy-container {
    margin-top: 32px;
    padding-top: 16px;
    margin-bottom: 8px;
    border-top: 1px solid $color-divider;
  }

  .publish-container {
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px solid $color-divider;
    @include flex-row;
    @include flex-horizontal-center;
  }

  .privacy-label {
    margin-bottom: 16px;
    color: $color-blue;
  }

  .privacy-description {
    margin-left: 24px;
    margin-bottom: 8px;
    color: $color-hint-text;
  }

  .publish-button {
    width: 96px;
  }
</style>