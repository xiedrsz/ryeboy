import axios from "axios";
import config from "js/config";

axios.defaults.baseURL = config.apiAddress;

class api {
  static login(account, password) {
    return axios.post("/login", {
      account,
      password
    });
  }

  static logout() {
    return axios.post("/logout");
  }

  static getDiaries(label, filter) {
    return axios.post("/getDiaries", {
      label,
      filter
    });
  }

  static getUsers(users) {
    return axios.post("/getUsers", {
      users
    });
  }
}

export default api;