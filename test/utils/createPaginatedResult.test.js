const createPaginatedResult = require("../../src/utils/createPaginatedResult");

const data = [{ name: "John", surname: "Doe" }];
describe("Given a page,limit,offset,totalNumber and data", () => {
  test("Should return an paginated result with a next field", () => {
    let totalNumber = 10;
    let limit = 5;
    let offset = 0;
    let page = 1;
    let next = { limit, page: page + 1 };
    let result = { data, totalNumber, next };
    expect(
      createPaginatedResult(page, limit, offset, totalNumber, data)
    ).toEqual(result);
  });
  test("Should return an paginated result with a previous field", () => {
    let totalNumber = 10;
    let limit = 5;
    let offset = 5;
    let page = 2;
    let previous = { limit, page: page - 1 };
    let result = { data, totalNumber, previous };
    expect(
      createPaginatedResult(page, limit, offset, totalNumber, data)
    ).toEqual(result);
  });
});
