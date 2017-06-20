<template>
  <div class="page full-page" title="群介绍" actions='[{"text":"保存","clickHandler":"save-group-msg"}]'>
    <div class="page-main">
      <textarea v-model="description" rows="8"></textarea>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
        return {
          description: ""
        }
      },
      components: {

      },
      methods: {
        save() {
          if (!!this.description) {
            this.$store.dispatch("saveGroupInfo", {
              groupInfo: {
                _id: "593a4a596d3b3619b82de164",
                description: this.description
              },
              callback: () => {
                window.history.go(-1);
              }
            });
          } else {
            // Todo, 弹出提示
          }
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