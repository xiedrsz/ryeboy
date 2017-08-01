const debug = true;
const useLocalApi = false;
// const useLocalApi = true;

var configFile, apiAddress;
try {
  configFile = require("./config.json");
  apiAddress = `https://${configFile.api_host}:${configFile.api_port}`;
} catch (error) {
  apiAddress = "https://127.0.0.1:2443";
}

const config = {
  debug,
  apiAddress: debug ? useLocalApi ? apiAddress : "https://114.215.131.176:2443" : "https://api.ryeboy.org",
  ossAddress: "http://ryeboy-app-apk-1.oss-cn-qingdao.aliyuncs.com",
  pageSize: {
    normal: 10,
    user: 20,
    answer: 20
  }
};

module.exports = config;