const debug = true;

const config = {
  debug,
  root: "/",
  apiAddress: debug ? "http://192.168.0.120:8082" : "https://api.ryeboy.org",
  ossAddress: "http://ryeboy-app-apk-1.oss-cn-qingdao.aliyuncs.com"
};

module.exports = config;