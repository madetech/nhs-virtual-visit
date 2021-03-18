import verifyToken from "../../src/usecases/verifyToken";
import logger from "../../logger";

describe("verifyToken", () => {
  const req = {
    headers: {
      cookie: "token=sample.token.value",
    },
  };

  const res = {
    writeHead: jest.fn(() => res),
    end: jest.fn(),
  };

  it("calls the supplied callback if the token is valid", async () => {
    const expectedProps = { a: 1 };
    const callback = jest.fn(() => expectedProps);
    const authenticationToken = {
      type: "wardStaff",
    };
    const tokenProvider = {
      validate: jest.fn(() => authenticationToken),
    };
    const container = {
      getTokenProvider: () => tokenProvider,
      getRegenerateToken: () => jest.fn().mockReturnValue({}),
      getRetrieveDepartmentById: () =>
        jest.fn().mockReturnValue({ error: null }),
      logger
    };

    const result = await verifyToken(callback)({ req, res, container });
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
      getRetrieveDepartmentById: () =>
        jest.fn().mockReturnValue({ error: null }),
      logger
    };

    await verifyToken(callback)({ req, res, container });
    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: "/",
    });
  });

  it("redirects if there are no cookies", async () => {
    const callback = jest.fn();
    const tokenProvider = {
      validate: jest.fn(() => false),
    };
    const container = {
      getTokenProvider: () => tokenProvider,
      getRetrieveDepartmentById: () =>
        jest.fn().mockReturnValue({ error: null }),
      logger
    };
    req.headers.cookie = "";

    await verifyToken(callback)({ req, res, container });
    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: "/",
    });
  });

  it("updates the cookie if the token is regenerated", async () => {
    const regenRes = {
      writeHead: jest.fn(() => regenRes),
      end: jest.fn(),
      setHeader: jest.fn(),
    };

    const regenReq = {
      headers: {
        cookie: "token=sample.token.value",
      },
    };

    const callback = jest.fn();
    const authenticationToken = {
      type: "wardStaff",
    };
    const tokenProvider = {
      validate: jest.fn(() => authenticationToken),
    };

    const regeneratedToken = { type: "wardStaff", test: "1" };

    const regenerateTokenSpy = jest.fn().mockReturnValue({
      isTokenRegenerated: true,
      regeneratedEncodedToken: "encodedToken",
      regeneratedToken: regeneratedToken,
    });

    const container = {
      getTokenProvider: () => tokenProvider,
      getRegenerateToken: () => regenerateTokenSpy,
      getRetrieveDepartmentById: () =>
        jest.fn().mockReturnValue({ error: null }),
      logger
    };

    await verifyToken(callback)({
      req: regenReq,
      res: regenRes,
      container,
    });

    expect(regenerateTokenSpy).toHaveBeenCalledWith(authenticationToken);

    expect(regenRes.setHeader).toHaveBeenCalledWith("Set-Cookie", [
      "token=encodedToken; httpOnly; path=/;",
    ]);

    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        authenticationToken: regeneratedToken,
      })
    );
  });
});
