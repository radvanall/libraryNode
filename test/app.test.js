const request = require("supertest");
const book = require("../src/model/book");
const user = require("../src/model/user");
const app = require("../src/app");
const bcrypt = require("bcrypt");

jest.mock("../src/model/book");
jest.mock("../src/model/user");
// jest.mock("../src/middleware/multipartMulter");
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
  genres: "[1,3,4]",
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
      expect(book.createBook).toHaveBeenCalledWith(
        ["test book", "This is a test book.", null, "no autor"],
        [1, 3, 4]
      );
    });
    test("should get the title,desc,author and id in the updateBook function", async () => {
      await request(app).put(`/books/${1}`).send(postBook);
      expect(book.updateBook).toHaveBeenCalledWith([
        "test book",
        "This is a test book.",
        "no autor",
        "1",
      ]);
    });
  });
  describe("Testing the delete book endpoint", () => {
    test("The endpoint should return status 201", async () => {
      book.getBookById.mockReturnValue({ cover: "na" });
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
const allUsers = [
  {
    id: 1,
    login: "test",
    pass: "1111",
  },
  { id: 2, login: "test2", pass: "2222" },
];
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
  describe("testing the get all users endpoint", () => {
    test("should return an array of users", async () => {
      user.getAllUsers.mockReturnValue(allUsers);
      const response = await request(app).get("/users");
      expect(response.body).toEqual(allUsers);
      expect(response.status).toEqual(200);
    });
  });
  describe("testing the post new user endpoint", () => {
    test("status code should be 200", async () => {
      const response = await request(app).post("/users").send(exUser);
      expect(response.status).toEqual(200);
    });
    test("status code should be 200", async () => {
      const response = await request(app).post("/users").send(exUser);
      expect(response.status).toEqual(200);
    });
    test("should specify json in the content type header", async () => {
      const response = await request(app).post("/users").send(exUser);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
    test("should recive a password and a login in the createUser function", async () => {
      await request(app).post("/users").send(exUser);
      expect(user.createUser).toHaveBeenCalledWith(
        expect.arrayContaining([
          "test",
          expect.stringMatching(/^.{55,}$/),
          null,
        ])
      );
    });
  });
  describe("testing the delete user endpoint", () => {
    test("The endpoint should return status 201", async () => {
      const response = await request(app).delete(`/users/${1}`);
      expect(response.status).toEqual(201);
    });
  });
});
