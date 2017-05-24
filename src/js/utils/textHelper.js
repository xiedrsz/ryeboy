const _ = require("lodash");

class textHelper {
  escape(text) {
    text = _.escape(text);
    text = text.split("\n").join("<br>");
    return text;
  }

  getDiaryText(diary) {
    var text = diary.text === undefined ? "" : diary.text;
    if (text.length == 0) {
      text = "我在默默地坚持种麦子，请为我加油鼓励吧！";
    }
    return text;
  }

  getUserName(user) {
    let text = "";
    if (user) {
      text = user.username;
      if (user.nickname) {
        text = user.nickname;
      }
    }
    return text;
  }

  getLessonWeightName(weight) {
    switch (weight) {
    case 1:
      return "最重要功课";
    case 2:
      return "重要功课";
    case 3:
      return "次重要功课";
    }
  }

  getLessonGroupName(group) {
    switch (group) {
    case 304:
      return "麦式运动";

    case 401:
      return "早睡";

    case 411:
      return "早起";
    }
  }
}

module.exports = new textHelper();