const debug = true;

const config = {
  debug,
  apiAddress: debug ? "https://127.0.0.1:2443" : "https://api.ryeboy.org",
  ossAddress: "http://ryeboy-app-apk-1.oss-cn-qingdao.aliyuncs.com"
};

module.exports = config;