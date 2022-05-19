const sessionStorage = window.sessionStorage;
export default {
  getItem(key) {
    try {
      return JSON.parse(sessionStorage.getItem(key));
    } catch (err) {
      return null;
    }
  },
  setItem(key, val) {
    try {
      if (sessionStorage) {
        sessionStorage.setItem(key, JSON.stringify(val));
      }
    } catch (err) {
      return null;
    }
  },
  removeItem(key) {
    sessionStorage.removeItem(key);
  },
  clear() {
    sessionStorage.clear();
  }
};
