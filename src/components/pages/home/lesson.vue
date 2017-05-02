<template>
  <div class="page-layout">
    <div class="action-container">
      <div class="action">2月6日</div>
      <div class="mdl-layout-spacer"></div>
      <div class="action" @click="$router.push('/pages/lesson-manage')">管理</div>
      <div class="action">保存</div>
      <div class="action">发布</div>
    </div>
    <div class="card-container">
      <div v-for="weight in cards"
           class="weight-container">
        <div class="weight-block">
          <div class="weight-text">{{ weight.name }}</div>
          <div class="mdl-layout-spacer"></div>
          <div>
            <checkbox :id="weight.value"
                      text="全选"
                      :changed="weightSelectAll"></checkbox>
          </div>
        </div>
        <div class="card-list">
          <div v-for="card in weight.cards"
               class="card">
            <img class="card-icon"
                 :src="'../../img/card-' + card.id + '.png'">
            <div class="card-name">{{ card.name }}</div>
            <checkbox :id="card.id"
                      :selected="card.selected"></checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  function getWeightName(weight) {
    switch (weight) {
    case 1:
      return "最重要功课";
    case 2:
      return "重要功课";
    case 3:
      return "次重要功课";
    }
  }

  function getWeightCards(cards, weight, selectedCards) {
    let result = [];
    cards.forEach(item => {
      if (item.group) {
        if (selectedCards[item.group] != item.id) {
          return;
        }
      }
      if (item.weight == weight) {
        result.push(Object.assign({
          selected: false
        }, item));
      }
    });
    return result;
  }

  export default {
    data() {
      return {
        cards: []
      };
    },
    methods: {
      weightSelectAll(data) {
        this.cards.forEach(item => {
          if (item.value == data.id) {
            item.cards.forEach(card => {
              card.selected = data.selected;
            });
          }
        });
      }
    },
    mounted() {
      let cards = require("store/cards.json");
      for (var weight = 1; weight < 4; weight++) {
        this.cards.push({
          value: weight,
          name: getWeightName(weight),
          cards: getWeightCards(cards, weight, this.$store.state.lesson.selectedCards)
        });
      }
    },
    components: {
      "checkbox": require("ui/checkbox.vue"),
    }
  };
</script>

<style lang="scss"
       scoped>
  @import "~scss/main.scss";
  .page-layout {
    @include flex-column;
    width: 100%;
  }

  .action-container {
    height: 36px;
    min-height: 36px;
    padding-left: 8px;
    padding-right: 8px;
    @include flex-row;
    border-bottom: 1px solid $color-divider;
    background-color: $color-hint-block;
  }

  .action {
    color: $color-secondary-text;
    text-decoration: none;
    display: table-cell;
    white-space: nowrap;
    padding-left: 8px;
    padding-right: 8px;
    text-align: left;
    line-height: 36px;
  }

  .card-container {
    @include flex-column;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .weight-container {
    padding-bottom: 16px;
    padding-top: 8px;
    border-bottom: 1px solid $color-divider;
  }

  .weight-block {
    @include flex-row;
    padding: 16px;
    color: $color-secondary-text;
  }

  .weight-text {
    color: $color-blue;
  }

  .card-list {
    @include flex-row;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
  }

  .card {
    @include flex-column;
    width: 64px;
    margin-bottom: 16px;
    padding-left: 16px;
  }

  .card-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px 4px 4px 4px;
    background-color: $color-disable;
  }

  .card-name {
    font-size: 12px;
  }
</style>