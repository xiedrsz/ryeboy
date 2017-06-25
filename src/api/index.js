import axios from "axios";
import config from "js/config";

axios.defaults.baseURL = config.apiAddress;
axios.defaults.headers["Accept"] = "application/json";

class api {
  static getPersonalDiaries(userid, last, filter, data) {
    return axios.get("/diary/personal", {
      params: {
        userid,
        last,
        filter,
        data
      }
    });
  }

  static addDiaryComment(id, comment) {
    return axios.post("/diary/addComment", {
      id,
      comment
    });
  }

  static getMoreDiaryComments(id, last) {
    return axios.get(`/diary/${id}/more-comments/${last}`);
  }

  static getDiaryComments(id) {
    return axios.get(`/diary/${id}/comments`);
  }

  static getDiary(id) {
    return axios.get(`/diary/${id}`);
  }

  static getLesson(userid, date) {
    return axios.get("/diary/getLesson", {
      params: {
        userid,
        date
      }
    });
  }

  static publishLesson(data) {
    return axios.post("/diary/publishLesson", data);
  }

  static getLessonDetail(id) {
    return axios.get("/diary/getLessonDetail", {
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
    // return axios.post("/logout");
  }

  static getDiaries(label, filter, last) {
    return axios.get("/diaries", {
      params: {
        label,
        filter,
        last
      }
    });
  }

  static getUsers(users) {
    return axios.get("/users/many", {
      params: {
        users
      }
    });
  }

  static setAuthorization() {
    axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.jwt}`;
  }
}

export default api;