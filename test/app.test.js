const request = require("supertest");
const book = require("../src/model/book");
const user = require("../src/model/user");
const app = require("../src/app");

jest.mock("../src/model/book");
jest.mock("../src/model/user");
const bookEx = {
  id: 1,
  title: "test book",
  description: "This is a test book.",
  cover: "cover",
  author: "no autor",
};
const postBook = {
  title: "test book",
  desc: "This is a test book.",
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
      expect(response.body).toEqual(bookEx);
      expect(response.status).toEqual(200);
    });
  });
  describe("given a book with title, description,cover and author", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/books").send(postBook);
      expect(response.status).toEqual(201);
    });
    test("should specify json in the content type header", async () => {
      const response = await request(app).post("/books").send(postBook);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
    test("should get the title, desc, cover and author in the createBookController", async () => {
      await request(app).post("/books").send(postBook);
      expect(book.createBook).toHaveBeenCalledWith([
        "test book",
        "This is a test book.",
        "cover",
        "no autor",
      ]);
    });
    test("should get the title,desc,cover,author and id in the updateBook function", async () => {
      await request(app).put(`/books/${1}`).send(postBook);
      expect(book.updateBook).toHaveBeenCalledWith([
        "test book",
        "This is a test book.",
        "cover",
        "no autor",
        "1",
      ]);
    });
  });
  describe("Testing the delete book endpoint", () => {
    test("The endpoint should return status 201", async () => {
      const response = await request(app).delete(`/books/${1}`);
      expect(response.status).toEqual(201);
    });
  });
});
const exUser = {
  id: 1,
  login: "test",
  pass: "1111",
};
describe("testing the /users endpoint", () => {
  describe("testing  get user by id endpoint", () => {
    test("should return a user by id", async () => {
      user.getUserById.mockReturnValue(exUser);
      const userId = 1;
      const response = await request(app).get(`/users/${userId}`);
      expect(response.body.id).toEqual(userId);
      expect(response.body).toEqual(exUser);
      expect(response.status).toEqual(200);
    });
  });
});
