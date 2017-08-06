<template>
  <nav>
    <div class="nav-container">
      <div v-for="item in nav"
           :key="item.id"
           @click="$router.push(item.path)"
           class="nav-item">
        <span :class="{'badge': item.id == 4 && messageCount, 'active': $route.path == item.path }"
              :data-badge="messageCount">{{ item.name }}</span>
      </div>
    </div>
  </nav>
</template>

<script>
  export default {
    data() {
      return {
        nav: [
          {
            id: 1,
            path: "/home/diary",
            name: "日记"
          },
          {
            id: 2,
            path: "/home/lesson",
            name: "功课"
          },
          {
            id: 3,
            path: "/home/dynamic",
            name: "动态"
          },
          {
            id: 4,
            path: "/home/personal",
            name: "我的"
          }
        ]
      };
    },
    computed: {
      messageCount() {
        if (!this.$store.state.user.messageCount) {
          return 0;
        }
        let {
          comment,
          system
        } = this.$store.state.user.messageCount;
        let r = comment + system;
        return r > 99 ? "..." : r;
      }
    },
    mounted() {
      let width = this.$el.querySelector(".nav-container").clientWidth / 4;
      this.$el.querySelectorAll(".nav-item").forEach(item => {
        item.style.width = width + "px";
      });
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .nav-container {
    @include flex-row;
    border-top: 1px solid $color-divider;
    height: 48px;
    background-color: $color-hint-block;
  }

  .nav-item {
    height: 100%;
    @include flex-row;
    @include flex-center;
    position: relative;
  }

  .active {
    color: $color-blue;
  }

  .badge[data-badge]:after {
    content: attr(data-badge);
    position: absolute;
    color: #fff;
    padding: 0px 3px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12px;
    background: $color-red;
    border-radius: 2px;    
    margin-top: -6px;
    margin-left: -6px;
    min-width: 12px;
    text-align: center;
  }
</style>