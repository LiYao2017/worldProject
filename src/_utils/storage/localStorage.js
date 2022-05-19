const localStorage = window.localStorage;
export default {
  getItem(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (err) {
      return null;
    }
  },
  setItem(key, val) {
    try {
      if (localStorage) {
        localStorage.setItem(key, JSON.stringify(val));
      }
    } catch (err) {
      return null;
    }
  },
  removeItem(key) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  },
  keys() {
    return localStorage.keys();
  }
};
