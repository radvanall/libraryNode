const request = require("supertest");
const validate = require("../../src/utils/validateUpdateUser");
const req = {
  body: {
    login: "jhon",
    pass: "1111",
  },
  params: {
    id: 1,
  },
};
const req2 = {};
const req3 = {
  body: {
    login: "",
    pass: "",
  },
  params: {
    id: null,
  },
};
describe("testing the validateUpdateUser function", () => {
  describe("given a req object that have a body that have a login field and a pass field, and with a params field that have an id field", () => {
    test("when the fields are valid should return true", () => {
      expect(validate(req)).toEqual(true);
    });
    test("when the fields are empty should return false", () => {
      expect(validate(req3)).toEqual(false);
    });
  });
  describe("given a req object that doesn't have any fields", () => {
    test("should return false", () => {
      expect(validate(req2)).toEqual(false);
    });
  });
});
