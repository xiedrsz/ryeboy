<template>
  <div>
    <slot :user="userInfo"></slot>
  </div>
</template>
<script>
  import _ from "lodash";
  import config from "js/config.js";

  export default {
    props: {
      id: String
    },
    data() {
      return {
        userInfo: {
          id: "",
          username: "",
          score: "0"
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
          //userId: "59389e3d9c4d0228d7313b1b",
          userId: userId,
          callback: (userInfo) => {
            if (userInfo.portrait) {
              userInfo.avatar = `${config.ossAddress}/portraits/${userInfo._id}_${userInfo.portrait}.jpg`;
            } else {
              userInfo.avatar = '/img/default-avatar.png';
            }
            _.assign(this.userInfo, userInfo);
          }
        });
      }
    }
  };
</script>