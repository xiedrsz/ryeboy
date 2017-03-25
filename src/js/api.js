import axios from "axios";
import config from "js/config";

axios.defaults.baseURL = config.apiAddress;

class api {
  static login(account, password) {
    return axios.get("/login", {
      params: {
        account: account,
        password: password
      }
    });
  }
}

export default api;