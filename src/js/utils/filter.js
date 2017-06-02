import Vue from 'vue'

const datetime = require("js/utils/datetime.js");
/**
 * @Function format 格式化日期
 * @Param formatStr String 格式 [YYYY,MM,DD,hh,mm,ss]
 */
Vue.filter('time', (value) => {
    if (value == 'undefined' || value === "") {
      return ""
    }
    let result = datetime.formatDiaryCreated(value)
    return result;
})

