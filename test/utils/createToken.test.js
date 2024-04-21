const createToken = require("../../src/utils/createToken");
require("dotenv").config();
describe("given an object ,a key and an expirationTime", () => {
  test("should return a string", () => {
    const result = createToken(
      { username: "admin" },
      process.env.ACCESS_TOKEN_SECRET,
      "1m"
    );
    expect(typeof result).toBe("string");
  });
});
