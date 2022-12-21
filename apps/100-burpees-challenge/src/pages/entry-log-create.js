const EntryLogModel = require("../models/entry-logs");
const EntryLog = EntryLogModel.EntryLog;

module.exports = () => ({
  log: new EntryLog(),
  errors: { errorCount: 0 },
  submit() {
    this.errors = this.log.validate();
    if (this.errors.errorCount > 0) return;
    this.log.upsert();
    window.location = "entry-logs.html";
  },
});
