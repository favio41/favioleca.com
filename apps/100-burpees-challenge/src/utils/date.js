function DateUtils() {
  return {
    isoDate(date) {
      return date.toISOString().split("T")[0];
    },
    isoTime(date) {
      return new Intl.DateTimeFormat("en-GB", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }).format(date);
    },
    yesterday(date) {
      const now = date || new Date();
      now.setDate(now.getDate() - 1);
      return now;
    },
    isDateToday(date) {
      return DateUtils().isoDate(date) === DateUtils().isoDate(new Date());
    },
    isDateYesterday(date) {
      return (
        DateUtils().isoDate(date) ===
        DateUtils().isoDate(DateUtils().yesterday())
      );
    },
    isDateAfterNow(date) {
      return DateUtils().isoDate(date) > DateUtils().isoDate(new Date());
    },
    isAfterNow(date) {
      return date > new Date();
    },
  };
}

module.exports = DateUtils();
