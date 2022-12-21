const DateUtils = require("../utils/date");
const EntryLogModel = require("../models/entry-logs");
const UserPreferencesModel = require("../models/user-preferences");
const EntryLog = EntryLogModel.EntryLog;

module.exports = () => {
  let chart = null;
  const successEmoticon = [
    "&#x1F389", // party
    "&#x1F349", // watermelon
    "&#x1F36D", // lolly
    "&#x1F352", // cherries
    "&#x1F30B", // volcano
    "&#x1F380", // ribbon
    "&#x1F37B", // beer mugs
  ];

  const successChallenge = {
    SUPER: "&#x1F389",
    NOT_BAD: "&#x1F3A9",
    COUCH: "&#x1F3E0",
    GAME_OVER: "&#x1F3AA",
  };
  return {
    debugModeCount: 0,
    hasChallengeFinished() {
      return new Date() >= new Date("2023-02-01") && this.debugModeCount < 5;
    },
    isChallengePendingToStart() {
      return new Date() < new Date("2023-01-01") && this.debugModeCount < 5;
    },
    isChallengeActive() {
      return (
        (new Date("2023-01-01") <= new Date() &&
          new Date("2023-02-01") > new Date()) ||
        this.debugModeCount >= 5
      );
    },
    analytics: EntryLogModel.EntryLogAnalytics(),
    userPreferences: UserPreferencesModel.getUserPreferences(),
    todaySuccessEmoticon() {
      return successEmoticon[new Date().getDay()];
    },
    addEntryLogCount(count) {
      new EntryLog({ count }).upsert();
      this.refresh();
    },
    refresh() {
      this.updateGraph();
      this.analytics = EntryLogModel.EntryLogAnalytics();
    },
    graphDataCal() {
      const burpees = this.analytics
        .sumCountGroupedByShortDate()
        .sort((a, b) => (a.isoDate < b.isoDate ? -1 : 1))
        .map((group) => ({
          x: group.logsName,
          y: group.sumCount,
        }));

      const target = burpees.map((point) => {
        const result = Object.assign({}, point);
        result.y = 100;
        return result;
      });

      return {
        burpees,
        target,
      };
    },
    updateGraph() {
      if (!chart) return;
      const graphData = this.graphDataCal();

      chart.data.datasets[0].data = graphData.burpees;
      chart.data.datasets[1].data = graphData.target;
      chart.update("none");
    },
    startGraph() {
      if (!this.isChallengeActive) {
        return;
      }

      console.log("startGraph step #2", this.isChallengeActive);
      const graphData = this.graphDataCal();

      chart = new Chart(document.getElementById("myChart"), {
        type: "line",
        data: {
          datasets: [
            {
              label: "Burpees",
              data: graphData.burpees,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
            {
              label: "Target",
              data: graphData.target,
              fill: false,
              borderColor: "rgb(192, 192, 192)",
            },
          ],
        },
      });
    },
    getStatsIcon(level) {
      return successChallenge[level];
    },
  };
};
