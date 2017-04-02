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
}

module.exports = new textHelper();