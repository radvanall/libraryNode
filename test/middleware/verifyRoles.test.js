const request = require("supertest");
const express = require("express");
const verifyRoles = require("../../src/middleware/verifyRoles");

const app = express();

describe("verifyRoles middleware", () => {
  it("should return 401 if no role is provided", async () => {
    app.get("/test", verifyRoles(5150), (req, res) => {
      res.sendStatus(200);
    });
    const response = await request(app).get("/test").send();
    expect(response.status).toBe(401);
  });

  it("should return 401 if role does not match any allowed role", async () => {
    app.get(
      "/test0",
      (req, res, next) => {
        req.roles = 5159;
        next();
      },
      verifyRoles(5150),
      (req, res) => {
        res.sendStatus(200);
      }
    );
    const response = await request(app).get("/test0");
    expect(response.status).toBe(401);
  });

  it("should pass through if role matches an allowed role", async () => {
    app.get(
      "/test1",
      (req, res, next) => {
        req.roles = 5150;
        next();
      },
      verifyRoles(5150),
      (req, res) => {
        res.sendStatus(200);
      }
    );

    const response = await request(app).get("/test1");

    expect(response.status).toBe(200);
  });
});
