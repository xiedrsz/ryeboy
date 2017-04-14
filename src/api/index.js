import axios from "axios";
import config from "js/config";

axios.defaults.baseURL = config.apiAddress;

class api {
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
}

export default api;