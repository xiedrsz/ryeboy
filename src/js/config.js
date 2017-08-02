const debug = true;

var configFile, apiAddress;
try {
  configFile = require("./config.json");
  if (configFile.debug_useRemoteApi) {
    apiAddress = `https://${configFile.debug_remoteApiAddress}`;
  } else {
    apiAddress = `https://${configFile.debug_localApiAddress}`;
  }
} catch (error) {
  apiAddress = "https://127.0.0.1:2443";
}

const config = {
  debug,
  apiAddress: debug ? apiAddress : "https://api.ryeboy.org",
  ossAddress: "http://ryeboy-app-apk-1.oss-cn-qingdao.aliyuncs.com",
  pageSize: {
    normal: 10,
    user: 20,
    answer: 20
  }
};

module.exports = config;