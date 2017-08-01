<template>
  <div class="mdl-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <button class="mdl-layout-icon mdl-button mdl-js-button mdl-button--icon"
              @click="back">
        <i class="material-icons">arrow_back</i>
      </button>
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">{{ $store.state.page.title }}</span>
<!--        <div class="mdl-layout-spacer"></div>-->
        <div class="mdl-layout-spacer">
          <component v-if="spacer"
                     :is="spacer">
          </component>
        </div>
        <nav class="mdl-navigation"
             v-if="toolbars && toolbars.length > 0">
          <div class="mdl-navigation__link"
               v-for="item in toolbars"
               :key="item.text || item.icon"
               @click="item.click">
            <i class="material-icons"
               v-if="item.icon">{{ item.icon }}</i>
            <span v-if="item.text">{{ item.text }}</span>
          </div>
        </nav>
      </div>      
    </header>
    <main class="mdl-layout__content">
      <keep-alive>
        <router-view></router-view>
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
          // this.$store.commit("page_setActions", page.getAttribute("actions"));
          this.$store.commit("page_setIcons", page.getAttribute("icons"));
        }
      }
    },
    components: {
      "searchbox": require("components/ui/searchbox.vue")
    },
    computed: {
      title() {
        return this.$store.state.page.title;
      },
      actions() {
        return this.$store.state.page.actions;
      },
      icons() {
        return this.$store.state.page.icons;
      },
      seleted() {
        return this.$store.state.page.seleted;
      },
      toolbars() {
        return this.$store.state.page.toolbars;
      },
      spacer() {
        return this.$store.state.page.spacer;
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