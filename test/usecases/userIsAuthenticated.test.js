import userIsAuthenticated from "../../src/usecases/userIsAuthenticated";
import logger from "../../logger";

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
        getRetrieveDepartmentById: () =>
          jest.fn().mockReturnValue({ error: null }),
        logger
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
        getRetrieveDepartmentById: () =>
          jest.fn().mockReturnValue({ error: null }),
        logger
      };
    });
    it("returns false when the token is invalid", async () => {
      expect(
        await userIsAuthenticated(container)("token=invalid.token")
      ).toEqual(false);
    });
  });

  it("returns false when the ward is not present", async () => {
    container.logger = logger;
    container.getRetrieveDepartmentById = () =>
      jest.fn().mockReturnValue({ error: "ERROR!" });
    expect(await userIsAuthenticated(container)("token=valid.token")).toEqual(
      false
    );
  });

  it("returns false when the ward is not present", async () => {
    container.logger = logger;
    container.getRetrieveDepartmentById = () =>
      jest.fn().mockReturnValue({ error: "ERROR!" });
    expect(await userIsAuthenticated(container)("token=valid.token")).toEqual(
      false
    );
  });
});
