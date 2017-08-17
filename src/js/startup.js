var ossAddress = "https://ryeboy-app-apk-1.oss-cn-qingdao.aliyuncs.com";
window.app = {};

function XHR(file, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr.responseText);
    }
  };
  xhr.open("GET", file, true);
  xhr.send();
}

function exitApp() {
  if (navigator.app) {
    navigator.app.exitApp();
  }
}

XHR("js/app.json", function(responseText) {
  Object.assign(window.app, JSON.parse(responseText));

  jsonp(`${ossAddress}/config/app.version.json?callback=jsonpCallback&hash=${(new Date()).getTime()}`, function(error, data) {
    if (error) {
      document.querySelector(".startup-status").style.visibility = "visible";
      return;
    }

    var localBundle = `dist/bundle.${window.app.build}.js`;
    var remoteBundle = localBundle;
    var remoteBuild = data["build." + window.app.client];
    if (remoteBuild && remoteBuild > window.app.build) {
      remoteBundle = `${ossAddress}/js/bundle.${data.build}.js`;
    }

    window.app.serverVersion = data;

    $script([
      "lib/material-design-lite/material.min.js",
      "lib/swipe/swipe.js",
      "lib/flatpickr/flatpickr.min.js",
      "lib/axios.min.js"], function() {
      $script(remoteBundle, function(error) {
        if (error) {
          $script(localBundle);
        }
      });
    });
  });
});