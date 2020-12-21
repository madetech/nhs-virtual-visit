import userIsAuthenticated from "../../src/usecases/userIsAuthenticated";

describe("userIsAuthenticated", () => {
  let tokenProvider;
  let container;

  describe("valid user token", () => {
    beforeEach(() => {
      tokenProvider = {
        validate: jest.fn(() => ({ type: "wardStaff" })),
      };
      container = {
        getTokenProvider: () => tokenProvider,
        getRetrieveWardById: () => jest.fn().mockReturnValue({ error: null }),
      };
    });
    it("returns the payload of the token when it is valid", async () => {
      expect(
        await userIsAuthenticated(container)("token=valid.token")
      ).toEqual({ type: "wardStaff" });
    });
  });

  describe("invalid user token", () => {
    beforeEach(() => {
      tokenProvider = {
        validate: jest.fn(() => false),
      };
      container = {
        getTokenProvider: () => tokenProvider,
        getRetrieveWardById: () => jest.fn().mockReturnValue({ error: null }),
      };
    });
    it("returns false when the token is invalid", async () => {
      expect(
        await userIsAuthenticated(container)("token=invalid.token")
      ).toEqual(false);
    });
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
