import axios from "axios";
import config from "js/config";
// 引入 mocks
import "../../mocks"

axios.defaults.baseURL = config.apiAddress;

class api {
  static getLessonDetail(id) {
    return axios.get("/getLessonDetail", {
      params: {
        id
      }
    });
  }

  static getUser(userid) {
    return axios.get("/getUser", {
      params: {
        userid
      }
    });
  }

  static getRecommendedChannels() {
    return axios.get("/getRecommendedChannels");
  }

  static setSubscribedChannels(userid, channels) {
    return axios.post("/setSubscribedChannels", {
      userid,
      channels
    });
  }

  static getSubscribedChannels(userid) {
    return axios.get("/getSubscribedChannels", {
      params: {
        userid
      }
    });
  }

  static login(account, password) {
    return axios.post("/login", {
      account,
      password
    });
  }

  static logout() {
    return axios.post("/logout");
  }

  static getDiaries(label, filter, last) {
    return axios.post("/getDiaries", {
      label,
      filter,
      last
    });
  }

  static getUsers(users) {
    return axios.post("/getUsers", {
      users
    });
  }

  // 动态部分接口
  // 获取 关注、粉丝 数目
  static getFansNum() {
    return axios.post("/getFansNum");
  }

  //动态日记接口
  //获取 日记发布者的头像、用户名，日记内容、发布时间、日记标签，点赞的数量，评论的数量、内容，用户是否已点赞
  //authorAvater,authorName,content,time,goodNum,commentNum,lable,isGood
  static getDynamicDiaries() {
    return axios.post("/getDynamicDiaries");
  }

  //已关注接口
  //获取已关注的用户总数，关注用户上限，用户头像，用户名，是否取消关注
  static getConcerns() {
    return axios.post("/getConcerns")
  }

  //粉丝接口
  //获取粉丝总数，粉丝头像，用户名，粉丝ID号，点击头像进入个人页面
  static getFans() {
    return axios.post("/getFans")
  }

  // 获取新关注人/换一批
  static getNewConcern() {
    return axios.post("/getNewConcern")
  }

  // 关注 
  static concern() {
    return axios.post("/concern")
  }

  // 取消关注
  static cancelConcern() {
    return axios.post("/cancelConcern")
  }

  // 点赞
  static like() {
    return axios.post("/like")
  }
  
  // 评论
  static comment() {
    return axios.post("/comment")
  }
}

// 暂时暴露到全局
window.api = api;

export default api;