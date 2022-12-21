const DateUtils = require("../../src/utils/date");

const TODAY_BEFORE = new Date("2022-11-10T21:32:43.000Z");
const TODAY = new Date("2022-11-10T22:33:44.000Z");
const TODAY_LATER = new Date("2022-11-10T23:34:45.000Z");
const TOMORROW = new Date("2022-11-11T22:33:44.000Z");
const YESTERDAY = new Date("2022-11-09T22:33:44.000Z");

describe("utils/date", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(TODAY);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("should return isoDate", () => {
    expect(DateUtils.isoDate(new Date())).toEqual("2022-11-10");
  });

  test("should return isoTime", () => {
    expect(DateUtils.isoTime(new Date())).toEqual("22:33:44");
  });

  test("should return yesterday", () => {
    expect(DateUtils.yesterday(new Date())).toEqual(new Date(YESTERDAY));
  });

  describe("isDateToday", () => {
    test("when is today, then return true", () => {
      expect(DateUtils.isDateToday(TODAY)).toBeTruthy();
    });

    test("when is not today, then return false", () => {
      expect(DateUtils.isDateToday(YESTERDAY)).toBeFalsy();
    });
  });

  describe("isDateYesterday", () => {
    test("when is yesterday, then return true", () => {
      expect(DateUtils.isDateYesterday(YESTERDAY)).toBeTruthy();
    });

    test("when is not yesterday, then return false", () => {
      expect(DateUtils.isDateYesterday(TODAY)).toBeFalsy();
    });
  });

  describe("isDateAfterNow", () => {
    test("when date is after now, then return true", () => {
      expect(DateUtils.isDateAfterNow(TOMORROW)).toBeTruthy();
    });

    test("when date is not after now, then return false", () => {
      expect(DateUtils.isDateAfterNow(YESTERDAY)).toBeFalsy();
    });
  });

  describe("isAfterNow", () => {
    test("when is after now, then return true", () => {
      expect(DateUtils.isAfterNow(TODAY_LATER)).toBeTruthy();
    });

    test("when is not after now, then return false", () => {
      expect(DateUtils.isAfterNow(TODAY_BEFORE)).toBeFalsy();
    });
  });
});
