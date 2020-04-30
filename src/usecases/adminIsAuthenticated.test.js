import adminIsAuthenticated from "./adminIsAuthenticated";

describe("adminIsAuthenticated", () => {
  let tokenProvider;
  let container;

  describe("valid admin token", () => {
    beforeEach(() => {
      tokenProvider = {
        validate: jest.fn((token) => ({ admin: true })),
      };
      container = {
        getTokenProvider: () => tokenProvider,
      };
    });

    it("returns the payload of the token when it is valid", () => {
      expect(adminIsAuthenticated(container)("token=valid.token")).toEqual({
        admin: true,
      });
    });
  });

  describe("invalid admin token", () => {
    beforeEach(() => {
      tokenProvider = {
        validate: jest.fn((token) => false),
      };
      container = {
        getTokenProvider: () => tokenProvider,
      };
    });

    it("returns the payload of the token when it is valid", () => {
      expect(adminIsAuthenticated(container)("token=valid.token")).toEqual(
        false
      );
    });
  });

  describe("valid user token", () => {
    beforeEach(() => {
      tokenProvider = {
        validate: jest.fn((token) => ({ admin: false })),
      };
      container = {
        getTokenProvider: () => tokenProvider,
      };
    });

    it("returns the payload of the token when it is valid", () => {
      expect(adminIsAuthenticated(container)("token=valid.token")).toEqual(
        false
      );
    });
  });
});
