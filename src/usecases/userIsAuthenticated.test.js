import userIsAuthenticated from "./userIsAuthenticated";

describe("userIsAuthenticated", () => {
  let tokenProvider;
  let container;

  beforeEach(() => {
    tokenProvider = {
      validate: jest.fn((token) => {
        if (token === "valid.token") {
          return token;
        } else {
          return false;
        }
      }),
    };
    container = {
      getTokenProvider: () => tokenProvider,
    };
  });

  it("returns the payload of the token when it is valid", () => {
    expect(userIsAuthenticated(container)("token=valid.token")).toEqual(
      "valid.token"
    );
  });

  it("returns false when the token is invalid", () => {
    expect(userIsAuthenticated(container)("token=invalid.token")).toEqual(
      false
    );
  });
});
