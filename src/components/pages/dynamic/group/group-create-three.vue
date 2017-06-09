<template>
  <div class="page full-page" title="创建组(3/3)">
    <label class="create-lable" v-for="(age,index) in ageGroups" :for="'radio_'+index" @click.stop.prevent="select(index)">
      <span class="create-value">{{age}}</span>
      <input name="ageRange" type="radio" :id="'radio_'+index" v-model="radioValue" />
      <i class="material-icons" :class="{'check': index == radioValue }">{{index == radioValue ? 'check_circle':'radio_button_unchecked'}}</i>
    </label>
    <div class="btn-box">
      <button @click="create" class="btn-main">确认创建</button>
    </div>
  </div>
</template>

<script>
  const ageRanges = ["0-15", "16-23", "24-30", "31-45", "45-"];

  export default {
    data() {
        return {
          checked: true,
          ageGroups: ["15岁以下", '16岁-23岁', '24岁-30岁', '31岁-45岁', '45岁以上'],
          radioValue: 0,
          age_range: ""
        }
      },
      computed: {
        groupInfoTmp() {
          return this.$store.state.group.groupInfoTmp;
        }
      },
      created() {
        this.age_range = this.groupInfoTmp.age_range || "0-15";
        this.radioValue = ageRanges.indexOf(this.age_range);
      },
      methods: {
        select(index) {
            this.radioValue = index;
            this.age_range = ageRanges[index];
          },
          create() {
            this.$store.commit("group_saveTmp", {
              age_range: this.age_range,
              creator: "59389e3d9c4d0228d7313b19"
            });

            this.$store.dispatch("createGroup", {
              callback: (group) => {
                this.$store.commit("group_saveTmp", group);
                this.$store.commit("group_saveInfo", this.groupInfoTmp);
                this.$router.push({
                  path: '/dynamic/group-info'
                })
              }
            });
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