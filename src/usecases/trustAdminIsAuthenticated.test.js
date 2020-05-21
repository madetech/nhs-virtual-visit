import trustAdminIsAuthenticated from "./trustAdminIsAuthenticated";

describe("trustAdminIsAuthenticated", () => {
  let tokenProvider;
  let container;

  describe("valid trustAdmin token", () => {
    beforeEach(() => {
      tokenProvider = {
        validate: jest.fn(() => ({ type: "trustAdmin" })),
      };
      container = {
        getTokenProvider: () => tokenProvider,
      };
    });

    it("returns the payload of the token when it is valid", () => {
      expect(trustAdminIsAuthenticated(container)("token=valid.token")).toEqual(
        {
          type: "trustAdmin",
        }
      );
    });
  });

  describe("invalid trustAdmin token", () => {
    beforeEach(() => {
      tokenProvider = {
        validate: jest.fn(() => false),
      };
      container = {
        getTokenProvider: () => tokenProvider,
      };
    });

    it("returns the payload of the token when it is valid", () => {
      expect(trustAdminIsAuthenticated(container)("token=valid.token")).toEqual(
        false
      );
    });
  });

  describe("valid user token", () => {
    beforeEach(() => {
      tokenProvider = {
        validate: jest.fn(() => ({ type: "wardStaff" })),
      };
      container = {
        getTokenProvider: () => tokenProvider,
      };
    });

    it("returns the payload of the token when it is valid", () => {
      expect(trustAdminIsAuthenticated(container)("token=valid.token")).toEqual(
        false
      );
    });
  });
});
