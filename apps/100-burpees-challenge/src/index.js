const entryLogs = require("./pages/entry-logs");
const entryLogCreate = require("./pages/entry-log-create");
const dashboard = require("./pages/dashboard");

document.addEventListener("alpine:init", () => {
  Alpine.data("entryLogs", entryLogs);
  Alpine.data("entryLogCreate", entryLogCreate);
  Alpine.data("dashboard", dashboard);
});
