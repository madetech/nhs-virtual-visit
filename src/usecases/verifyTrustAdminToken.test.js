import verifyTrustAdminToken from "./verifyTrustAdminToken";

describe("verifyTrustAdminToken", () => {
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
      type: "trustAdmin",
    };
    const tokenProvider = {
      validate: jest.fn(() => authenticationToken),
    };
    const container = {
      getTokenProvider: () => tokenProvider,
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

    verifyTrustAdminToken(callback)({ req, res, container });
    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: "/wards/login",
    });
  });
});
