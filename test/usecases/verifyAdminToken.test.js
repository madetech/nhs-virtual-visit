import verifyAdminToken from "../../src/usecases/verifyAdminToken";

describe("verifyAdminToken", () => {
  const res = {
    writeHead: jest.fn(() => res),
    end: jest.fn(),
    setHeader: jest.fn(),
  };
  const req = {
    headers: {
      cookie: "token=sample.token.value",
    },
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
      getRegenerateToken: () => jest.fn().mockReturnValue({}),
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
      getRegenerateToken: () => jest.fn().mockReturnValue({}),
    };

    verifyAdminToken(callback)({ req, res, container });
    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: "/admin/login",
    });
  });

  it("redirects if there are no cookies", async () => {
    const noCookieReq = {
      headers: {
        cookie: "",
      },
    };

    const callback = jest.fn();
    const tokenProvider = {
      validate: jest.fn(() => false),
    };
    const container = {
      getTokenProvider: () => tokenProvider,
      getRegenerateToken: () => jest.fn().mockReturnValue({}),
    };

    verifyAdminToken(callback)({ req: noCookieReq, res, container });
    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: "/admin/login",
    });
  });

  it("updates the cookie if the token is regenerated", () => {
    const callback = jest.fn();
    const authenticationToken = {
      type: "admin",
    };
    const tokenProvider = {
      validate: jest.fn(() => authenticationToken),
    };

    const regeneratedToken = { type: "admin", test: "1" };

    const container = {
      getTokenProvider: () => tokenProvider,
      getRegenerateToken: () =>
        jest.fn().mockReturnValue({
          isTokenRegenerated: true,
          regeneratedEncodedToken: "encodedToken",
          regeneratedToken: regeneratedToken,
        }),
    };

    verifyAdminToken(callback)({ req, res, container });

    expect(res.setHeader).toHaveBeenCalledWith("Set-Cookie", [
      "token=encodedToken; httpOnly; path=/;",
    ]);

    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        authenticationToken: regeneratedToken,
      })
    );
  });
});
