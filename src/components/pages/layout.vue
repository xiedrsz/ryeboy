<template>
  <div class="mdl-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <button class="mdl-layout-icon mdl-button mdl-js-button mdl-button--icon"
              onclick="history.go(-1);">
        <i class="material-icons">arrow_back</i>
      </button>
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">{{ title }}</span>
        <div class="mdl-layout-spacer"></div>
      </div>
    </header>
    <main class="mdl-layout__content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import * as types from "store/mutation-types";

export default {
  methods: {
    updateTitle() {
      let page = document.querySelector(".page");
      if (page) {
        this.$store.commit(types.SET_PAGE_TITLE, page.getAttribute("title"));
      }
    }
  },
  computed: {
    title() {
      return this.$store.state.page.title;
    }
  },
  mounted() {
    this.updateTitle();
  },
  updated() {
    setTimeout(() => {
      this.updateTitle();
    }, 0);

  }
};

</script>