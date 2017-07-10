import Vue from 'vue'

const datetime = require("js/utils/datetime.js");
/**
 * @Function time 格式化日期
 */
Vue.filter('time', (value) => {
  if (value == 'undefined' || value === "") {
    return ""
  }
  let result = datetime.formatDiaryCreated(value)
  return result;
});

/**
 * @Function ago 多久之前
 */
Vue.filter('ago', (value) => {
  if (value == 'undefined' || value === "") {
    return ""
  }
  let result = datetime.createdFromNow(value)
  return result;
});

/**
 * @Function msgNum 消息数量
 */
Vue.filter('msgNum', (value) => {
  if (value == 'undefined' || value === "") {
    return ""
  }

  if (value > 99)
    return '...'

  return value
});