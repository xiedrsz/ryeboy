<template>
  <div>
    <slot :user="userInfo"></slot>
  </div>
</template>
<script>
  import _ from "lodash";

  export default {
    props: {
      id: String
    },
    data() {
      return {
        userInfo: {
          id: "",
          username: "",
          level: "0"
        }
      }
    },
    created() {
      this.getUser(this.id);
    },
    methods: {
      // 获取用户信息
      getUser(userId) {
        this.$store.dispatch("getUser", {
          userId: "59389e3d9c4d0228d7313b1b",
          callback: (userInfo) => {
            _.assign(this.userInfo, userInfo);
          }
        });
      }
    }
  };
</script>