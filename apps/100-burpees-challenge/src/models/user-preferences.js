const DB = require("../utils/db");

const CHALLENGE_OBJECTIVE = {
  LINEAR: "LINEAR",
  LOG: "LOG",
};

class UserPreferences {
  constructor(rawUserPreferences = {}) {
    this.challengeObjective =
      rawUserPreferences.challengeObjective || CHALLENGE_OBJECTIVE.LINEAR;
  }

  save() {
    DB.saveJson(DB.keys.USER_PREFERENCES, this);
  }
}

module.exports = {
  CHALLENGE_OBJECTIVE,
  getUserPreferences() {
    return new UserPreferences(DB.retrieveJson(DB.keys.USER_PREFERENCES, {}));
  },
};
