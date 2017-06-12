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
        <nav class="mdl-navigation"
             v-if="toolbars && toolbars.length > 0">
          <div class="mdl-navigation__link"
               v-for="item in toolbars"
               @click="item.click">{{ item.text }}</div>
        </nav>
      </div>
    </header>
    <main class="mdl-layout__content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
  import app from "js/app";

  export default {
    watch: {
      "$route" () {
        app.toolbars.clear();
        this.$nextTick(() => {
          this.updateHeader();
        });
      }
    },
    methods: {
      updateHeader() {
        let page = document.querySelector(".page");
        if (page) {
          this.$store.commit("page_setTitle", page.getAttribute("title"));
        }
      }
    },
    computed: {
      title() {
        return this.$store.state.page.title;
      },
      toolbars() {
        return this.$store.state.page.toolbars;
      }
    },
    beforeMount() {
      app.toolbars.clear();
    },
    mounted() {
      this.updateHeader();
    }
  };
</script>