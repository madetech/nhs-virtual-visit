import verifyAdminToken from "./verifyAdminToken";
import moment from "moment";

describe("verifyAdminToken", () => {
  const req = {
    headers: {
      cookie: "token=sample.token.value",
    },
  };

  const res = {
    writeHead: jest.fn(() => res),
    end: jest.fn(),
    setHeader: jest.fn(),
  };

  it("calls the supplied callback if the token is valid", async () => {
    const expectedProps = { a: 1 };
    const callback = jest.fn(() => expectedProps);
    const authenticationToken = {
      type: "admin",
    };
    const tokenProvider = {
      validate: jest.fn(() => authenticationToken),
    };
    const container = {
      getTokenProvider: () => tokenProvider,
    };

    const result = verifyAdminToken(callback)({ req, res, container });
    expect(callback).toHaveBeenCalledWith({
      req,
      res,
      container,
      authenticationToken,
    });
    expect(result).toBe(expectedProps);
  });

  it("redirects if the token is not valid", async () => {
    const callback = jest.fn();
    const tokenProvider = {
      validate: jest.fn(() => false),
    };
    const container = {
      getTokenProvider: () => tokenProvider,
    };

    verifyAdminToken(callback)({ req, res, container });
    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: "/wards/login",
    });
  });

  it("redirects if there are no cookies", async () => {
    const callback = jest.fn();
    const tokenProvider = {
      validate: jest.fn(() => false),
    };
    const container = {
      getTokenProvider: () => tokenProvider,
    };
    req.headers.cookie = "";

    verifyAdminToken(callback)({ req, res, container });
    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: "/wards/login",
    });
  });

  it("sets a new token if the old one is expiring", async () => {
    const req = {
      headers: {
        cookie: "token=sample.token.value",
      },
    };

    const callback = jest.fn();
    const authenticationToken = {
      type: "admin",
      exp: moment().add(5, "minutes").unix(),
    };

    const tokenProvider = {
      validate: jest.fn(() => authenticationToken),
      generate: jest.fn(() => "encodedToken"),
    };
    const container = {
      getTokenProvider: () => tokenProvider,
    };

    verifyAdminToken(callback)({ req, res, container });
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        authenticationToken: authenticationToken,
      })
    );
    expect(res.setHeader).toHaveBeenCalledWith("Set-Cookie", [
      `token=encodedToken; httpOnly; path=/;`,
    ]);
  });
});
