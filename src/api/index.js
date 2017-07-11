import axios from "axios";
import config from "js/config";

axios.defaults.baseURL = config.apiAddress;
axios.defaults.headers["Accept"] = "application/json";

class api {
  static getLikes(id, last) {
    return axios.get(`/diary/likes/${id}`, {
      params: {
        last
      }
    });
  }

  static setLike(id, userid) {
    return axios.post(`/diary/like/${id}`, {
      userid
    });
  }

  static getNotices(userid, type, lastFetchAt, last) {
    return axios.get("/notices", {
      params: {
        userid: "57158aedd7baf14a7069f8bf",
        type,
        last,
        lastFetchAt: new Date("2017-5-20"),
      }
    });
  }

  static getPersonalDiaries(id, userid, last, filter, data) {
    return axios.get("/diary/personal", {
      params: {
        id,
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

  static getDiary(id, userid) {
    return axios.get(`/diary/${id}`, {
      params: {
        userid,
      }
    });
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

  static getDiaries(label, filter, last, userid) {
    return axios.get("/diaries", {
      params: {
        label,
        filter,
        last,
        userid
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

  static delay(timeout) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  }
}

export default api;