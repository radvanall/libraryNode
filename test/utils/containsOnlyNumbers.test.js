const containsOnlyNumbers = require("../../src/utils/containsOnlyNumbers");

describe("Given a function that verify if a string conatains only numbers", () => {
  test("Should return true for-222", () => {
    const res = containsOnlyNumbers(222);
    expect(res).toEqual(true);
  });
  test("Should return true for-'222'", () => {
    const res = containsOnlyNumbers("222");
    expect(res).toEqual(true);
  });
  test("Should return false for-'2f2'", () => {
    const res = containsOnlyNumbers("2f2");
    expect(res).toEqual(false);
  });
  test("Should return false for-''", () => {
    const res = containsOnlyNumbers("");
    expect(res).toEqual(false);
  });
  test("Should return false for-'ddd'", () => {
    const res = containsOnlyNumbers("ddd");
    expect(res).toEqual(false);
  });
});
