import verifyToken from "./verifyToken";

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
      foo: true,
    };
    const container = {
      tokens: {
        validate: jest.fn(() => authenticationToken),
      },
    };

    const result = verifyToken(callback, container)({ req, res });
    expect(callback).toHaveBeenCalledWith({ req, res, authenticationToken });
    expect(result).toBe(expectedProps);
  });

  it("redirects if the token is not valid", async () => {
    const callback = jest.fn();
    const container = {
      tokens: {
        validate: jest.fn(() => false),
      },
    };

    verifyToken(callback, container)({ req, res });
    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: "/wards/login",
    });
  });

  it("redirects if there are no cookies", async () => {
    const callback = jest.fn();
    const container = {
      tokens: {
        validate: jest.fn(() => false),
      },
    };
    req.headers.cookie = "";

    verifyToken(callback, container)({ req, res });
    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: "/wards/login",
    });
  });
});
