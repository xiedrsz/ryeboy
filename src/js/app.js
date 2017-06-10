import cordova from "js/cordova";
require("lazysizes");

class app {
  init(vue) {
    this.vue = vue;
    this.cordova = new cordova(this);
  }

  constructor() {
    
  }
}

module.exports = new app();