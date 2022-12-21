const DB = require("../utils/db");
const MathUtils = require("../utils/math");
const DateUtils = require("../utils/date");

const DAYS_IN_JAN = 31;

function EntryLogStore() {
  function getRawEntryLogs() {
    return DB.retrieveJson(DB.keys.LOGS);
  }

  function setRawEntryLogs(entries) {
    DB.saveJson(DB.keys.LOGS, entries);
  }

  return {
    logs() {
      return getRawEntryLogs().map((rawLog) => new EntryLog(rawLog));
    },
    upsert(aBurpeeLog) {
      const entries = getRawEntryLogs();
      const index = entries.findIndex((rawLog) => rawLog.id === aBurpeeLog.id);
      if (index > -1) entries[index] = aBurpeeLog;
      else entries.push(aBurpeeLog);
      setRawEntryLogs(entries);
    },
    remove(aBurpeeLog) {
      const entries = getRawEntryLogs();
      const index = entries.findIndex((rawLog) => rawLog.id === aBurpeeLog.id);
      if (index > -1) entries.splice(index, 1);
      setRawEntryLogs(entries);
    },
  };
}

function generateId() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return Math.floor(Math.random() * 1e19).toString();
}

class EntryLog {
  constructor(rawLog = {}) {
    this.id = rawLog.id || generateId();
    this.dateTime = rawLog.dateTime ? new Date(rawLog.dateTime) : new Date();
    this.count = rawLog.count > 0 ? rawLog.count : 30;
    this.version = rawLog.version || 1;
  }

  delete() {
    new EntryLogStore().remove(this);
  }

  upsert() {
    if (this.validate().errorCount > 0) throw new Error("invalid" + this);
    new EntryLogStore().upsert(this);
  }

  get humanTime() {
    return this.dateTime.toLocaleString("en-GB", {
      hour: "numeric",
      minute: "numeric",
    });
  }

  // Perhaps should be moved to DateUtils
  get humanShortDate() {
    if (this.isToday) return "Today";
    if (this.wasYesterday) return "Yesterday";
    return this.shortDate;
  }

  get shortDate() {
    return this.dateTime.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
    });
  }

  get isoDate() {
    return DateUtils.isoDate(this.dateTime);
  }

  set isoDate(dateString) {
    const part = dateString.split("-");
    const fullYear = part[0];
    const month = part[1];
    const date = part[2];
    this.dateTime.setDate(date);
    this.dateTime.setMonth(month - 1);
    this.dateTime.setFullYear(fullYear);
  }

  get shortIsoTime() {
    return DateUtils.isoTime(this.dateTime).split(":").slice(0, 2).join(":");
  }

  set shortIsoTime(isoTime) {
    const part = isoTime.split(":");
    const hour = part[0];
    const minute = part[1];
    this.dateTime.setHours(hour);
    this.dateTime.setMinutes(minute);
    this.dateTime.setSeconds(0);
    this.dateTime.setMilliseconds(0);
  }

  get isToday() {
    return DateUtils.isDateToday(this.dateTime);
  }

  get wasYesterday() {
    return DateUtils.isDateYesterday(this.dateTime);
  }

  validate() {
    const errors = {
      errorCount: 0,
    };
    if (typeof this.count === "string") {
      try {
        this.count = parseInt(this.count);
      } catch (error) {
        errors.count = true;
        errors.errorCount += 1;
      }
    }
    if (DateUtils.isDateAfterNow(this.dateTime)) {
      errors.date = true;
      errors.errorCount += 1;
    } else if (DateUtils.isAfterNow(this.dateTime)) {
      errors.time = true;
      errors.errorCount += 1;
    }
    if (this.count <= 0) {
      errors.count = true;
      errors.errorCount += 1;
    }
    return errors;
  }

  valueOf() {
    return this.dateTime.valueOf();
  }
}

function EntryLogAnalytics() {
  const store = new EntryLogStore();

  return {
    groupedByHumanShortDate() {
      return groupedByDays("humanShortDate");
    },
    groupedByShortDate() {
      return groupedByDays("shortDate");
    },
    sumCountGroupedByShortDate() {
      return this.groupedByShortDate().map((group) => ({
        logsName: group.logsName,
        logs: group.logs,
        isoDate: group.isoDate,
        sumCount: sumCount(group.logs),
      }));
    },
    todayStats() {
      return {
        logs: todayLogs(),
        sumCount: sumCount(todayLogs()),
        expectedBurpees: calculateProgress(new Date()),
      };
    },
    totalStats() {
      const stats = store.logs().reduce(
        (prev, current) => {
          prev.totalBurpees += current.count;
          return prev;
        },
        {
          totalBurpees: 0,
        }
      );

      stats.totalExpected = DAYS_IN_JAN * 100;
      stats.percentageDone = Math.floor(
        (stats.totalBurpees / stats.totalExpected) * 100
      );
      if (stats.percentageDone > 90) stats.level = "SUPER";
      else if (stats.percentageDone > 50) stats.level = "NOT_BAD";
      else if (stats.percentageDone > 30) stats.level = "COUCH";
      else stats.level = "GAME_OVER";

      return stats;
    },
  };

  function calculateProgress(date) {
    const totalBurpees = sumCount(store.logs());
    const expectedBurpees = date.getDate() * 100;
    return expectedBurpees - totalBurpees;
  }

  function sumCount(logs) {
    return logs.map((log) => log.count).reduce(MathUtils.add, 0);
  }

  function todayLogs() {
    return store.logs().filter((log) => log.isToday);
  }

  function groupedByDays(key) {
    const result = store.logs().reduce((previous, current) => {
      function getKey() {
        return current[key];
      }

      if (!previous[getKey()]) {
        previous[getKey()] = [];
      }
      previous[getKey()].push(current);
      return previous;
    }, {});

    return Object.entries(result).map((part) => ({
      logsName: part[0],
      logs: part[1],
      isoDate: part[1][0].isoDate,
    }));
  }
}

module.exports = {
  EntryLogStore: EntryLogStore(),
  EntryLog,
  EntryLogAnalytics,
};
