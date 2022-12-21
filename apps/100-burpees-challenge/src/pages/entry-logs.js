const EntryLogModel = require("../models/entry-logs");

module.exports = () => ({
  pendingToDelete: null,
  groupLogs: [],
  createLog() {
    window.location = "entry-log-create.html";
  },
  sortLogs(logs) {
    return logs.sort((a, b) => a - b);
  },
  sortGroupedLogs(groupedLogs) {
    return groupedLogs.sort((a, b) => {
      return a.isoDate > b.isoDate ? -1 : 1;
    });
  },
  deleteLog() {
    this.pendingToDelete.delete();
    this.pendingToDelete = null;
    this.updateGroupLogs();
  },
  updateGroupLogs() {
    this.groupLogs = this.sortGroupedLogs(
      EntryLogModel.EntryLogAnalytics().groupedByHumanShortDate()
    );
  },
  init() {
    this.updateGroupLogs();
  },
});
