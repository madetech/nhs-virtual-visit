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
      getRetrieveWardById: () => jest.fn().mockReturnValue({ error: null }),
    };
  });

  it("returns the payload of the token when it is valid", async () => {
    expect(await userIsAuthenticated(container)("token=valid.token")).toEqual(
      "valid.token"
    );
  });

  it("returns false when the token is invalid", async () => {
    expect(await userIsAuthenticated(container)("token=invalid.token")).toEqual(
      false
    );
  });

  it("returns false when the ward is not present", async () => {
    container.getRetrieveWardById = () =>
      jest.fn().mockReturnValue({ error: "ERROR!" });
    expect(await userIsAuthenticated(container)("token=valid.token")).toEqual(
      false
    );
  });

  it("returns false when the ward is not present", async () => {
    container.getRetrieveWardById = () =>
      jest.fn().mockReturnValue({ error: "ERROR!" });
    expect(await userIsAuthenticated(container)("token=valid.token")).toEqual(
      false
    );
  });
});
