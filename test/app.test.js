const request = require("supertest");
const book = require("../src/model/book");
const app = require("../src/app");

jest.mock("../src/model/book");
const bookEx = {
  id: 1,
  title: "test book",
  description: "This is a test book.",
  cover: "cover",
  author: "no autor",
};
describe("testing the /books endpoint", () => {
  describe("testing the get one book endpoint", () => {
    test("should return a book by id", async () => {
      book.getBookById.mockReturnValue(bookEx);
      const bookId = 1;
      const response = await request(app).get(`/books/${bookId}`);
      expect(response.body.id).toEqual(bookId);
    });
  });
});
