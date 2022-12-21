const { EntryLogStore, EntryLog } = require("../src/models/entry-logs");

const TODAY = new Date("2022-11-10T22:33:44.000Z");
const TODAY_LATER = new Date("2022-11-10T23:34:45.000Z");
const TOMORROW = new Date("2022-11-11T22:33:44.000Z");
const YESTERDAY = new Date("2022-11-09T22:33:44.000Z");

describe("EntryLogs", () => {
  test("should be defined", () => {
    expect(EntryLogStore).toBeDefined();
  });
});

describe("EntryLog class", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(TODAY);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("should be defined", () => {
    expect(EntryLog).toBeDefined();
  });

  test("when given no parameters, then return defaults", () => {
    expect(new EntryLog()).toMatchSnapshot({
      id: expect.any(String),
    });
  });

  describe("isoDate", () => {
    test("when query for isoDate, then return isoDate", () => {
      expect(new EntryLog().isoDate).toMatchInlineSnapshot(`"2022-11-10"`);
    });

    test("when set isoDate, then should update dateTime", () => {
      const entryLog = new EntryLog();
      entryLog.isoDate = "2022-11-11";
      expect(entryLog.dateTime).toMatchInlineSnapshot(
        `2022-11-11T22:33:44.000Z`
      );
    });
  });

  describe("isoTime", () => {
    test("when query for isoTime, then return isoTime", () => {
      expect(new EntryLog().shortIsoTime).toMatchInlineSnapshot(`"22:33"`);
    });

    test("when set isoTime, then should update dateTime", () => {
      const entryLog = new EntryLog();
      entryLog.shortIsoTime = "10:20";
      expect(entryLog.dateTime).toMatchInlineSnapshot(
        `2022-11-10T10:20:00.000Z`
      );
    });
  });

  describe("queries", () => {
    test("when entryLog is today, isToday() has to be truthy", () => {
      const entryLog = new EntryLog({
        dateTime: TODAY,
      });
      expect(entryLog.isToday).toBeTruthy();
    });

    test("when entryLog it is tomorrow, isToday() has to be falsy", () => {
      const entryLog = new EntryLog({
        dateTime: TOMORROW,
      });
      expect(entryLog.isToday).toBeFalsy();
    });

    test("when entryLog is yesterday, wasYesterday() has to be truthy", () => {
      const entryLog = new EntryLog({
        dateTime: YESTERDAY,
      });
      expect(entryLog.wasYesterday).toBeTruthy();
    });

    test("when entryLog it is today, wasYesterday() has to be falsy", () => {
      const entryLog = new EntryLog({
        dateTime: TODAY,
      });
      expect(entryLog.wasYesterday).toBeFalsy();
    });
  });

  test("when ask for valueOf, then return dateTime.valueOf", () => {
    expect(new EntryLog().valueOf()).toMatchInlineSnapshot(`1668119624000`);
  });

  describe("validate", () => {
    test("when no errors, validate should represent no errors", () => {
      expect(new EntryLog().validate()).toMatchSnapshot();
    });

    test("when date is in the future, validate should contain 1 date error", () => {
      expect(new EntryLog({ dateTime: TOMORROW }).validate()).toMatchSnapshot();
    });

    test("when time is in the future, validate should contain 1 time error", () => {
      expect(
        new EntryLog({ dateTime: TODAY_LATER }).validate()
      ).toMatchSnapshot();
    });

    test("when count is invalid, validate should contain 1 count error", () => {
      const entryLog = new EntryLog();
      entryLog.count = 0;
      expect(entryLog.validate()).toMatchSnapshot();
    });
  });
});
