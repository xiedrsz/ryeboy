<template>
  <div class="mdl-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <button class="mdl-layout-icon mdl-button mdl-js-button mdl-button--icon"
              @click="back">
        <i class="material-icons">arrow_back</i>
      </button>
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">{{ title }}</span>
        <div class="mdl-layout-spacer"></div>
        <nav class="mdl-navigation"
             v-if="toolbars && toolbars.length > 0">
          <div class="mdl-navigation__link"
               v-for="item in toolbars"
               @click="item.click">
            <i class="material-icons"
               v-if="item.icon">{{ item.icon }}</i>
            <span v-if="item.text">{{ item.text }}</span>
          </div>
        </nav>
      </div>
    </header>
    <main class="mdl-layout__content">
      <keep-alive :include="cached">
        <router-view v-keep-scroll-position></router-view>
      </keep-alive>
    </main>
  </div>
</template>

<script>
  export default {
    watch: {
      "$route" () {
        this.$app.toolbars.clear();
        this.$nextTick(() => {
          this.updateHeader();
        });
      }
    },
    methods: {
      back() {
        this.$app.back();
      },
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
      },
      cached() {
        return this.$store.state.page.cached + "";
      }
    },
    beforeMount() {
      this.$app.toolbars.clear();
    },
    mounted() {
      this.updateHeader();
    }
  };
</script>