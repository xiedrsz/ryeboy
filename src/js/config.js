const debug = true;

const config = {
  debug,
  apiAddress: debug ? "http://192.168.31.188:8082" : "https://api.ryeboy.org",
  ossAddress: "http://ryeboy-app-apk-1.oss-cn-qingdao.aliyuncs.com",
  pageSize: 10
};

module.exports = config;