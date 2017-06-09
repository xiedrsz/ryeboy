<template>
  <div class="page full-page" title="创建组(3/3)">
    <label class="create-lable" v-for="(age,index) in ageGroups" :for="'radio_'+index" @click.stop.prevent="select(index)">
      <span class="create-value">{{age}}</span>
      <input name="ageRange" type="radio" :id="'radio_'+index" v-model="radioValue" />
      <!-- v-model="currentValue" :value="getKey(one)" check_circle ref="icon"-->
      <i class="material-icons" :class="{'check': index == radioValue }">{{index == radioValue ? 'check_circle':'radio_button_unchecked'}}</i>
    </label>
    <div class="btn-box">
      <button @click="create" class="btn-main">创建</button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
        return {
          checked: true,
          ageGroups: ["15岁以下", '16岁-23岁', '24岁-30岁', '31岁-45岁', '45岁以上'],
          radioValue: 0
        }
      },
      methods: {
        select(index) {
            this.radioValue = index
              /*this.$nextTick(()=>{          
                this.$refs.icon.forEach((n)=>{
                  n.innerHTML = "radio_button_unchecked"
                })
                this.$refs.icon[index].innerHTML = "check_circle"
              })*/
          },
          create() {
            this.$store.dispatch("createGroup");
          }
      }
  };
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .create-lable {
    @include flex-row;
    @include flex-vertical-center;
    padding: 10px 15px;
    border-bottom: 1px solid $color-divider;
    background: #fff;
    .create-value {
      flex: 1;
      @include flex-column;
    }
    input {
      visibility: hidden;
    }
  }
  
  .btn-box {
    margin: 15px;
  }
  
  .btn-main {
    width: 100%;
    height: 44px;
    line-height: 44px;
    background: #00aaee;
    font-size: 16px;
    color: #fff;
    border-radius: 8px;
    box-shadow: none;
    border: none;
    box-sizing: border-box;
    outline: none;
  }
  
  .btn-main:active {
    background: #0078a9;
    outline: none;
  }
  
  .material-icons {
    color: #a5a5a5;
    &.check {
      color: #00aaee;
    }
  }
</style>