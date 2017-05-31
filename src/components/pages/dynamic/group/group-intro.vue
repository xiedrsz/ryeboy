<template>
  <div class="page" title="群介绍" actions='[{"text":"保存","clickHandler":"save-group-msg"}]'>
    <div class="page-main">
      <textarea v-model="descrption" rows="8"></textarea>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
        return {
          descrption: ""
        }
      },
      components: {

      },
      methods: {
        save() {
          if (!!this.descrption) {
            console.log(this.descrption);
            this.$store.dispatch("saveGroupInfo", {
              id: "123",
              descrption: this.descrption
            }, () => {
              console.log("LLL")
              window.history.go(-1);
            });
          } else {
            // Todo
          }
        }
      },
      mounted() {
        this.$on("save-group-msg", () => {
          this.save()
        })
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
  .mdl-layout__content {}
  
  .page-main {
    padding: 10px 15px;
    box-sizing: border-box;
  }
  
  textarea {
    width: 100%;
    padding: 5px;
    border: 1px solid $color-divider;
    background: $color-light-blue;
  }
</style>