import axios from "axios";
import config from "js/config";

axios.defaults.baseURL = config.apiAddress;

class api {
  static login(account, password) {
    return axios.post("/login", {
      account: account,
      password: password
    });
  }

  static logout() {
    return axios.post("/logout");
  }
}

export default api;