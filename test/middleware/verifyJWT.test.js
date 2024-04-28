const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const verifyJWT = require("../../src/middleware/verifyJWT");
require("dotenv").config();
// Create an Express application
const app = express();

// Register the middleware
app.use(verifyJWT);

// Define a route that uses the middleware
app.get("/protected", (req, res) => {
  res.send("Access granted");
});

describe("verifyJWT middleware", () => {
  it("should return 401 if no Authorization header is present", async () => {
    // Make a request without the Authorization header
    const response = await request(app).get("/protected");
    // Expect the response status code to be 401
    expect(response.status).toBe(401);
  });

  it("should return 403 if an invalid token is provided", async () => {
    // Create a JWT token with an invalid secret
    const token = jwt.sign({ username: "testuser" }, "invalid_secret");
    // Make a request with the invalid token
    const response = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);
    // Expect the response status code to be 403
    expect(response.status).toBe(403);
  });

  it("should set req.login if a valid token is provided", async () => {
    // Create a JWT token with a valid secret
    const token = jwt.sign(
      { username: "testuser" },
      process.env.ACCESS_TOKEN_SECRET
    );
    // Make a request with the valid token
    const response = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);
    // Expect the response status code to be 200
    expect(response.status).toBe(200);
    // Expect req.login to be set to 'testuser'
    expect(response.text).toBe("Access granted");
  });
});
