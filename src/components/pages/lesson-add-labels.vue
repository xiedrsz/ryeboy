<template>
  <div class="page"
       title="添加标签">
    <loadable-content :loadstate="loadstate">
      <div class="top-content">
        <div class="added">已添加标签({{ selectedLabels.length }}/{{ maxLabelCount }})</div>
        <div class="options">
          <checkbox v-model="recommend"
                    text="加精"></checkbox>
        </div>
      </div>
      <div class="content-wrap">
        <div class="label-content">
          <div v-for="category in activatedLabels"
               :key="category.categoryValue"
               class="category-block">
            <div>{{ category.categoryName }}</div>
            <div class="labels">
              <div v-for="item in category.items"
                   class="label"
                   :class="{ selected: item.selected }"
                   @click="selectLabel(item)"
                   :key="item.name">
                <div class="disabled">{{ item.displayName}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </loadable-content>
  </div>
</template>

<script>
  import _ from "lodash";
  import {
    labelCategory
  } from "store/modules/lesson.js";

  export default {
    data() {
      return {
        maxLabelCount: 3,
        loadstate: "loading",
        selectedLabels: [], // 选中的标签
        activatedLabels: [], // 可供选择的标签
        recommend: false, // 加精
      };
    },
    components: {
      "checkbox": require("ui/checkbox.vue"),
    },
    methods: {
      async submit() {
        let record = await this.$store.dispatch("lesson_getRecord");
        record.diary.labels = this.selectedLabels;
        if (this.recommend) {
          record.diary.options.push("recommend");
        }
        history.go(-1);
      },
      selectLabel(item) {
        if (!item.selected && this.selectedLabels.length == this.maxLabelCount) {
          this.$app.dialog.text("最多只能添加3个标签。");
          return;
        }

        item.selected = !item.selected;
        if (item.selected) {
          this.selectedLabels.push(item.name);
        } else {
          this.$app.collectionHelper.remove(this.selectedLabels, item.name);
        }
      },
      async load() {
        try {
          // 加载日记记录
          let record = await this.$store.dispatch("lesson_getRecord");
          this.selectedLabels = record.diary.labels;
          this.recommend = record.diary.options.includes("recommend");

          // 加载可选择的标签
          if (this.activatedLabels.length == 0) {
            let labels = this.$store.state.lesson.labels;
            let activatedLabels = {};
            _.each(labelCategory, (value, key) => {
              activatedLabels[key] = {
                categoryName: value,
                categoryValue: key,
                items: []
              };
            });
            _.each(labels, item => {
              item.selected = this.selectedLabels.includes(item.name);
              activatedLabels[item.category].items.push(item);
            });
            _.each(activatedLabels, item => {
              this.activatedLabels.push(item);
            });
          }

          this.loadstate = "loaded";
          this.$nextTick(() => {
            this.$app.adjustScrollableElement(".content-wrap", [".top-content"]);
          });
        } catch (error) {
          console.log(error);
        }
      }
    },
    async activated() {
      await this.load();

      this.$app.toolbars.create([{
        text: "确定",
        click: this.submit
      }]);
    },
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .top-content {
    @include flex-row;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid $color-divider;
  }

  .category-block {
    margin-top: 16px;
  }

  .labels {
    @include flex-row;
    flex-wrap: wrap;
    padding-top: 8px;
  }

  .label-content {
    padding: 8px 16px;
  }

  .label {
    @include flex-row;
    @include flex-center;
    position: relative;
    width: 72px;
    border-radius: 4px;
    background-color: #dedede;
    padding: 6px 0;
    margin-right: 8px;
    margin-bottom: 8px;
  }

  .selected {
    background-color: $color-blue;
    color: #fff;
  }

  .disabled {
    pointer-events: none;
  }
</style>