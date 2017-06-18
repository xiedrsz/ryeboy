const moment = require("moment");
moment.locale("zh-CN");

class datetime {
  static utcDate(time) {
    let offset = moment(time).utcOffset();
    return this.date(moment.utc(time).add(offset, "m")).toDate();
  }

  static date(date) {
    return moment(date).hours(0).minutes(0).seconds(0).millisecond(0);
  }

  static formatDiaryCreated(createdAt) {
    let current = moment(createdAt);
    let now = moment();
    let format = "H:mm";
    if (now.dayOfYear() - current.dayOfYear() == 1 && current.isSame(now, "year")) {
      format = "昨天 " + format;
    } else {
      if (current.isSame(now, "days")) {
        return current.fromNow();
      } else {
        format = "M[月]D[日] " + format;
      }
      if (!current.isSame(now, "year")) {
        format = "YYYY年" + format;
      }
    }
    return current.format(format);
  }

  static formatDiaryWeek(date) {
    let current = moment(date);
    let format = "[周]dd";
    return current.format(format);
  }

  static formatDiaryDateWithoutYear(date) {
    let current = moment(date);
    let format = "M[月]D[日]";
    return current.format(format);
  }

  static formatDiaryDate(date) {
    let current = moment(date);
    let now = moment();
    let format = "M[月]D[日]";
    if (!current.isSame(now, "year")) {
      format = "YYYY年" + format;
    }
    return current.format(format);
  }

  static formatCreated(createdAt) {
    let current = moment(createdAt);
    let now = moment();
    let format = "H:mm";
    if (now.dayOfYear() - current.dayOfYear() == 1 && current.isSame(now, "year")) {
      format = "昨天 " + format;
    } else {
      if (!current.isSame(now, "days")) {
        format = "M[月]D[日] " + format;
      }
      if (!current.isSame(now, "year")) {
        format = "YYYY年" + format;
      }
    }
    return current.format(format);
  }
}

module.exports = datetime;