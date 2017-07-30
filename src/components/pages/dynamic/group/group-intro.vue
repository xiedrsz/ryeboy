<template>
  <div class="page full-page" title="群介绍" actions='[{"text":"保存","clickHandler":"save-group-msg"}]'>
    <div class="page-main">
      <textarea v-model="description" rows="8" :readonly="!isCreator"></textarea>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
        return {
          description: "",
          isCreator: false
        }
      },
      methods: {
        save() {
          if (!!this.description) {
            this.$store.dispatch("saveGroupInfo", {
              groupInfo: {
                description: this.description
              },
              callback: () => {
                window.history.go(-1);
              }
            });
          } else {
            this.$promp("请输入组群介绍");
          }
        }
      },
      activated() {
        // 监听 保存 事件
        let groupInfo = this.$store.state.group.groupInfo;
        let user = this.$app.user;
        let creator = groupInfo.creator;
        let isCreator = this.isCreator = creator === user._id;
        if (isCreator) {
          this.$app.toolbars.create([{
            text: "保存",
            click: this.save
          }]);
        }
      },
      mounted() {
        this.$on("save-group-msg", () => {
          this.save()
        })

        // 初始化 description
        this.description = this.groupInfo.description
      },
      computed: {
        groupInfo() {
          return this.$store.state.group.groupInfo;
        }
      }
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .page-main {
    padding: 10px 15px;
    box-sizing: border-box;
  }
  
  textarea {
    width: 100%;
    padding: 5px;
    box-sizing: border-box;
    border: 1px solid $color-divider;
  }
</style>