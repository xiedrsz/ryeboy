<template>
  <div class="page">
    <div class="tabs">
      <div v-for="(tab, index) in tabs"
           :key="tab.id"
           class="tab-link"
           @click="switchView(index)"
           :class="{ active: tab.active }">
        {{ tab.text }}
      </div>
    </div>
    <keep-alive>
      <component :is="viewType">
      </component>
    </keep-alive>
  </div>
</template>

<script>
  const viewTypes = {
    0: "question",
    1: "user"
  };
  export default {
    data() {
      return {
        tabs: [
          {
            id: 0,
            text: "问题",
            active: true
          },
          {
            id: 1,
            text: "用户",
            active: false
          }
        ],
        tabIndex: 0,
        viewType: "question",
        content: "",
        email: ""
      };
    },
    components: {
      "question": require("components/pages/search/search-question.vue"),
    },
    methods: {
      async submit() {
        this.$el.focus();
        let keyword = this.$store.state.search.keyword;
        try {
          let data = (await this.$app.api.getSearch(keyword, this.viewType)).data;
          console.log(data);
        } catch (error) {
          this.$app.dialog.text("搜索失败。");
        }
      }
    },
    deactivated() {
      this.$store.commit("page_setSpacer");
    },
    activated() {
      this.$store.commit("page_setSpacer", "searchbox");
      this.$app.toolbars.create([{
        text: "搜索",
        click: this.submit
      }]);
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  @import "~scss/tabs.scss";
  .input-box {
    width: 100%;
    outline: none;
    resize: none;
    border: 1px solid #efefef;
    padding: 8px;
    color: $color-text;
    margin-top: 8px;
    margin-bottom: 32px;
  }

  .input-container {
    width: 90%;
    margin-top: 16px;
  }

  .label {
    font-size: 14px;
    color: $color-hint-text;
  }
</style>