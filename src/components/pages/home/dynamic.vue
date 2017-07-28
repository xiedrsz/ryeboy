<template>
  <div>
    <div class="dynamic_page" v-if="authenticated">
      <list>
        <router-link to="/dynamic/subscrible" class="mdl-navigation__link">
          <list-item text="订阅" to/>
        </router-link>
      </list>
      <list>
        <router-link to="/dynamic/concern/dynamic" class="mdl-navigation__link">
          <list-item text="关注" to/>
        </router-link>
      </list>
      <list>
        <a class="mdl-navigation__link" @click="group">
          <list-item text="小组" />
        </a>
      </list>
      <list>
        <list-item text="晨练" />
        <router-link to="/dynamic/plan" class="mdl-navigation__link">
          <list-item text="麦田" />
        </router-link>
      </list>
    </div>
    <div class="page-layout unauthenticated"
           v-if="!authenticated">
        (你还没有登录)
    </div>
  </div>
</template>

<script>
  export default {
    components: {
      "list": require("ui/list.vue"),
      "list-item": require("ui/list-item.vue")
    },
    computed: {
      authenticated() {
        return this.$store.state.user.authenticated;
      }
    },
    methods: {
      group() {
        // Todo, 判断用户是否加入小组
        let user = this.$app.user;
        let path = '/dynamic/group';
        if (!user.groupId) {
          path = '/dynamic/group-find';
        }

        this.$router.push({
          path
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .mdl-list {
    padding: 0 16px;
  }
  
  .mdl-list__item {
    padding: 16px 0;
  }
  
  .page-layout {
    @include flex-column;
    width: 100%;
  }
  
  .unauthenticated {
    @include flex-row;
    @include flex-center;
    height: 128px;
  }
</style>