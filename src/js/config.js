const debug = true;
const useLocalApi = true;

const config = {
  debug,
  apiAddress: debug ? useLocalApi ? "https://127.0.0.1:2443" : "https://114.215.131.176:2443" : "https://api.ryeboy.org",
  ossAddress: "http://ryeboy-app-apk-1.oss-cn-qingdao.aliyuncs.com",
  pageSize: 10
};

module.exports = config;