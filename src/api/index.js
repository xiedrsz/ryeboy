import config from "js/config";

axios.defaults.baseURL = config.apiAddress;
axios.defaults.headers["Accept"] = "application/json";

class api {
  static getNewMessageCount(userid, fetchTime) {
    return axios.get("/users/newMessageCount", {
      params: {
        userid,
        fetchTime
      }
    });
  }

  static getServerConfig(userid) {
    return axios.get("/config", {
      params: {
        userid
      }
    });
  }

  static getSearch(keyword, type) {
    return axios.get("search/keyword", {
      params: {
        keyword,
        type
      }
    });
  }

  static getAnswer(id) {
    return axios.get("search/getAnswer", {
      params: {
        id
      }
    });
  }

  static getAnswers(type, last) {
    return axios.get("search/getAnswers", {
      params: {
        type,
        last
      }
    });
  }

  static getAnswerTypes() {
    return axios.get("search/getAnswerTypes");
  }

  static getRecommendAnswers() {
    return axios.get("search/getRecommendAnswers");
  }

  static feedback(content, email, userid) {
    return axios.post("diary/feedback", {
      content,
      email,
      userid
    });
  }

  static updateUserInfo(id, name, content) {
    return axios.post("users/updateInfo", {
      id,
      name,
      content
    });
  }

  static getUserInfo(id) {
    return axios.get("users/info", {
      params: {
        id
      }
    });
  }

  static getUserStatus(id) {
    return axios.get("users/status", {
      params: {
        id
      }
    });
  }

  static getUserCards(id) {
    return axios.get("users/cards", {
      params: {
        id
      }
    });
  }

  static getPublishedDates(userid) {
    return axios.get("diary/publishedDates", {
      params: {
        userid
      }
    });
  }

  static getFavorites(userid, last) {
    return axios.get("/favorites", {
      params: {
        userid,
        last
      }
    });
  }

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

  static getNotices(userid, type, last) {
    return axios.get("/notices", {
      params: {
        userid,
        type,
        last
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

  static getActivatedChannels() {
    return axios.get("/diary/getActivatedChannels");
  }

  static setUserChannels(userid, data) {
    return axios.post("/diary/setUserChannels", {
      userid,
      data
    });
  }

  static getSubscribedChannels(userid) {
    return axios.get("/getSubscribedChannels", {
      params: {
        userid
      }
    });
  }

  static register(account, password) {
    return axios.post("/register", {
      account,
      password
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