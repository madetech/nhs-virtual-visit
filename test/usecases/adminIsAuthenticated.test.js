import adminIsAuthenticated from "../../src/usecases/adminIsAuthenticated";
import logger from "../../logger";

describe("adminIsAuthenticated", () => {
  let tokenProvider;
  let container;

  describe("valid admin token", () => {
    beforeEach(() => {
      tokenProvider = {
        validate: jest.fn(() => ({ type: "admin" })),
      };
      container = {
        getTokenProvider: () => tokenProvider,
        logger
      };
    });

    it("returns the payload of the token when it is valid", () => {
      expect(adminIsAuthenticated(container)("token=valid.token")).toEqual({
        type: "admin",
      });
    });
  });

  describe("invalid admin token", () => {
    beforeEach(() => {
      tokenProvider = {
        validate: jest.fn(() => false),
      };
      container = {
        getTokenProvider: () => tokenProvider,
        logger
      };
    });

    it("returns false", () => {
      expect(adminIsAuthenticated(container)("token=valid.token")).toEqual(
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
        logger
      };
    });

    it("returns the payload of the token when it is valid", () => {
      expect(adminIsAuthenticated(container)("token=valid.token")).toEqual(
        false
      );
    });
  });

  describe("valid trust admin token", () => {
    beforeEach(() => {
      tokenProvider = {
        validate: jest.fn(() => ({ type: "trustAdmin" })),
      };
      container = {
        getTokenProvider: () => tokenProvider,
        logger
      };
    });

    it("returns false", () => {
      expect(adminIsAuthenticated(container)("token=valid.token")).toEqual(
        false
      );
    });
  });
});
