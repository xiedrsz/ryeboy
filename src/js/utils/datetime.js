const moment = require("moment");

class datetime {
  formatDiaryCreated(createdAt) {
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

  formatDiaryDate(date) {
    let current = moment(date);
    let now = moment();
    let format = "M[月]D[日]";
    if (!current.isSame(now, "year")) {
      format = "YYYY年" + format;
    }
    return current.format(format);
  }

  formatCreated(createdAt) {
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

module.exports = new datetime();