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
        <nav class="mdl-navigation" v-if="actions || icons">
          <i class="material-icons" v-show ="icons && icons.length > 0" v-for="icon in icons" @click="emit(icon.clickHandler)">{{icon.text}}</i>
          <div class="mdl-navigation__link" v-show ="actions && actions.length > 0"
               v-for="action in actions"
               @click="emit(action.clickHandler)">{{ action.text }}</div>          
        </nav>
      </div>      
    </header>
    <main class="mdl-layout__content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
  export default {
    watch: {
      "$route" () {
        this.$nextTick(() => {
          this.updateHeader();
        });
      }
    },
    methods: {
      emit(clickHandler) {
        this.$children[0].$emit(clickHandler);
      },
      updateHeader() {
        let page = document.querySelector(".page");
        if (page) {
          this.$store.commit("page_setTitle", page.getAttribute("title"));
          this.$store.commit("page_setActions", page.getAttribute("actions"));
          this.$store.commit("page_setIcons", page.getAttribute("icons"));
        }
      }
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
      }
    },

    mounted() {
      this.updateHeader();
    }
  };
</script>