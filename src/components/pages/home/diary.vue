<template>
  <div class="page-layout">
    <div class="channel-container-wrap">
      <div class="channel-container">
        <span v-for="item in channels"
              :id="item.id"
              class="channel">
            {{ item.name }}
          </span>
      </div>
      <div class="channel-tools">
        <i class="material-icons md-20">expand_more</i>
      </div>
    </div>
    <div class="page-main">
      <div class="channel-filter-container">
        <span v-for="item in filters"
              :id="item.id"
              class="channel-filter">
            {{ item.name }}
          </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    channels() {
      return this.$store.state.diary.channels;
    },
    filters() {
      return this.$store.state.diary.filters;
    }
  }
};

</script>

<style lang="scss" scoped>
@import "~scss/main.scss";
.page-layout {
  @include flex-column;
  width: 100%;
}

.channel-container-wrap {
  height: 36px;
  min-height: 36px;
  @include flex-row;
  border-bottom: 1px solid $color-divider;
  background-color: $color-hint-block;
}

.channel-tools {
  @include flex-column;
  @include flex-center;
  height: 36px;
  width: 48px;
  min-width: 48px;
  color: $color-hint-text;
  background-color: $color-hint-block;
}

.channel-container {
  margin: 0;
  width: 100%;
  padding-left: 8px;
  padding-right: 8px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.page-main {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.channel {
  color: $color-secondary-text;
  text-decoration: none;
  display: table-cell;
  white-space: nowrap;
  padding-left: 8px;
  padding-right: 8px;
  text-align: left;
  line-height: 36px;
}

.channel.active {
  color: $color-blue;
}

.channel-filter-container {
  position: relative;
  display: table;
  margin: 0;
  padding-left: 8px;
  padding-right: 8px;
}

.channel-filter {
  color: $color-hint-text;
  text-decoration: none;
  display: table-cell;
  white-space: nowrap;
  padding-left: 8px;
  padding-right: 8px;
  text-align: left;
  line-height: 36px;
}

.channel-filter.active {
  color: $color-text;
}
 
</style>