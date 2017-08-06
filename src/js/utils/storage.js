class storage {
  static getObject(key, defaultValue) {
    if (localStorage[key]) {
      try {
        return JSON.parse(localStorage[key]);
      } catch (error) {
        return defaultValue;
      }
    } else {
      return defaultValue;
    }
  }

  static setObject(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
  }
}

module.exports = storage;