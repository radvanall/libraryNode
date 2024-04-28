const verifyRoles = require("../../src/middleware/verifyRoles");

describe("verifyRoles middleware", () => {
  it("should call next() if roles match", () => {
    const allowedRoles = [5250, 1990];
    const middleware = verifyRoles(...allowedRoles);
    const req = { roles: 5250 };
    const res = { sendStatus: jest.fn() };
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.sendStatus).not.toHaveBeenCalled();
  });

  it("should send 401 status if roles do not match", () => {
    const allowedRoles = [5250, 1990];
    const middleware = verifyRoles(...allowedRoles);
    const req = { roles: 2020 };
    const res = { sendStatus: jest.fn() };
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  it("should send 401 status if req.roles is not defined", () => {
    const allowedRoles = [5250, 1990];
    const middleware = verifyRoles(...allowedRoles);
    const req = {};
    const res = { sendStatus: jest.fn() };
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });
});
