const DB = require("../../src/utils/db");

describe("DB", () => {
  test("keys", () => {
    expect(DB.keys).toMatchSnapshot();
  });

  test("should save", () => {
    const key = "test";
    DB.saveJson(key, { hello: "world" });
    expect(window.localStorage.getItem(key)).toMatchSnapshot();
  });

  test("should retrieve", () => {
    const key = "test";
    window.localStorage.setItem(key, JSON.stringify({ hello: "world" }));
    expect(DB.retrieveJson(key)).toMatchSnapshot();
  });
});
