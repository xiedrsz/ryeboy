<template>
  <div class="page"
       title="收藏">
    <div class="tabs">
      <div v-for="(tab, index) in tabs"
           :key="tab.id"
           class="tab-link"
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
  export default {
    data() {
      return {
        tabs: [
          {
            id: 0,
            text: "日记",
            active: true
          },
        ],
        tabIndex: 0,
        viewType: "diary"
      };
    },
    components: {
      "diary": require("components/pages/favorite/favorite-diary.vue"),
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  @import "~scss/tabs.scss";
</style>