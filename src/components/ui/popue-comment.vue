<template>
  <div class="mdl-dialog-container" v-show="currentshowPopue">
    <div class="mdl-dialog" >
      <h4 class="mdl-popue__title">{{ title }}</h4>
      <div class="mdl-popue__content">
        <textarea class="input-box"
                  type="text" v-model="commentContent"
                  rows="8"></textarea>
      </div>
      <div class="mdl-dialog__actions">
        <button type="button mdl-js-button"
                class="mdl-button ok"
                @click="ok">确定</button>
        <button type="button mdl-js-button"
                class="mdl-button cancel"
                @click="cancle">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: "回复:"
      },
      showPopue: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      
    },
    data(){
      return {
        commentContent : "",
        currentshowPopue: false
      }
    },
    methods: {
      ok() {
/*        this.$store.commit("page_showDialog", {
          show: true
        });*/
        console.log("我给了评论")
        this.currentshowPopue = false
        this.$emit('changeval', false)
      },
      cancle() {
        this.currentshowPopue = false
        this.commentContent = ""
        this.$emit('changeval', false)
      }
    },
    watch: {
        showPopue: function (val) {
            this.currentshowPopue = val
        }
    }
  };
</script>

<style lang="scss" scoped>
@import "~scss/main.scss";
  .mdl-dialog-container {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.3);
  }

  .mdl-dialog-container .mdl-dialog {
    background-color: white;
    padding: 15px 15px 0;
  }

  .mdl-popue__title {
    font-size: 1.0rem;
    line-height: 1.0rem;
    font-weight: normal;
    margin: 5px 0 10px;
  }
  .input-box{
    width: 100%;
    padding:5px;
    border:none;
    background: $color-light-blue; 
  }
  .mdl-button{
    color:$color-blue; 
  }
  .ok{
    font-weight:bold;
  }
</style>