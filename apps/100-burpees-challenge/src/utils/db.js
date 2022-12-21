module.exports = {
  keys: {
    LOGS: "BURPEES_LOGS",
    USER_PREFERENCES: "BURPEES_USER_PREFERENCES",
  },
  saveJson(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  retrieveJson(key, def = []) {
    return JSON.parse(window.localStorage.getItem(key)) || def;
  },
};
