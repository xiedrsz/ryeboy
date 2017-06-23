import axios from "axios";
import config from "js/config";

axios.defaults.baseURL = config.apiAddress;
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status < 500;
}

class api {
  static getPersonalDiaries(userid, last, filter, data) {
    return axios.get("/getPersonalDiaries", {
      params: {
        userid,
        last,
        filter,
        data
      }
    });
  }

  static addDiaryComment(id, comment) {
    return axios.post("/addDiaryComment", {
      id,
      comment
    });
  }

  static getMoreDiaryComments(id, last) {
    return axios.get("/getMoreDiaryComments", {
      params: {
        id,
        last
      }
    });
  }

  static getDiaryComments(id) {
    return axios.get("/getDiaryComments", {
      params: {
        id
      }
    });
  }

  static getDiary(id) {
    return axios.get("/getDiary", {
      params: {
        id
      }
    });
  }

  static getLesson(userid, date) {
    return axios.get("/getLesson", {
      params: {
        userid,
        date
      }
    });
  }

  static publishLesson(data) {
    return axios.post("/publishLesson", data);
  }

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
    return axios.post("/authenticate", {
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
}

export default api;
