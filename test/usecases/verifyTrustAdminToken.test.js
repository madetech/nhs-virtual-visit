import verifyTrustAdminToken from "../../src/usecases/verifyTrustAdminToken";

describe("verifyTrustAdminToken", () => {
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
      type: "trustAdmin",
    };
    const tokenProvider = {
      validate: jest.fn(() => authenticationToken),
    };
    const container = {
      getTokenProvider: () => tokenProvider,
      getRegenerateToken: () => jest.fn().mockReturnValue({}),
    };

    const result = verifyTrustAdminToken(callback)({ req, res, container });
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

    verifyTrustAdminToken(callback)({ req, res, container });
    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: "/trust-admin/login",
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

    verifyTrustAdminToken(callback)({ req, res, container });
    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: "/trust-admin/login",
    });
  });

  it("updates the cookie if the token is regenerated", () => {
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
      type: "trustAdmin",
    };
    const tokenProvider = {
      validate: jest.fn(() => authenticationToken),
    };

    const regeneratedToken = { type: "trustAdmin", test: "1" };

    const regenerateTokenSpy = jest.fn().mockReturnValue({
      isTokenRegenerated: true,
      regeneratedEncodedToken: "encodedToken",
      regeneratedToken: regeneratedToken,
    });

    const container = {
      getTokenProvider: () => tokenProvider,
      getRegenerateToken: () => regenerateTokenSpy,
    };

    verifyTrustAdminToken(callback)({
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
