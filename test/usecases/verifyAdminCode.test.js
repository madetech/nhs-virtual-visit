import verifyAdminCode from "../../src/usecases/verifyAdminCode";
import logger from "../../logger";

describe("verifyAdminCode", () => {
  describe("Given an email isn't defined", () => {
    it("Returns an email is not defined error", async () => {
      const getVerifyAdminCodeGateway = jest.fn();
      const email = "";
      const password = "password";
      const { validAdminCode, error } = await verifyAdminCode({
        getVerifyAdminCodeGateway,
        logger
      })(email, password);

      expect(validAdminCode).toEqual(false);
      expect(error).toEqual("email is not defined");
    });
  });

  describe("Given an password isn't defined", () => {
    it("Returns a password is not defined error", async () => {
      const getVerifyAdminCodeGateway = jest.fn();
      const email = "nhs-admin@nhs.co.uk";
      const password = "";
      const { validAdminCode, error } = await verifyAdminCode({
        getVerifyAdminCodeGateway,
        logger
      })(email, password);

      expect(validAdminCode).toEqual(false);
      expect(error).toEqual("password is not defined");
    });
  });

  describe("Given a matching trust trustAdmin code", () => {
    it("Returns true", async () => {
      const container = {
        getVerifyAdminCodeGateway: () => async () => ({
          validAdminCode: true,
          error: null,
        }),
        logger
      };

      let response = await verifyAdminCode(container)(
        "nhs-admin@nhs.co.uk",
        "password"
      );
      expect(response.validAdminCode).toEqual(true);
      expect(response.error).toBeNull();
    });
  });

  describe("Given the user is not an admin", () => {
    it("Returns false", async () => {
      const container = {
        getVerifyAdminCodeGateway: () => async () => ({
          validAdminCode: false,
          error: null,
        }),
        logger
      };

      let response = await verifyAdminCode(container)(
        "nhs-manager@nhs.co.uk",
        "password"
      );
      expect(response.validAdminCode).toEqual(false);
    });
  });

  describe("Given a DB error", () => {
    it("Returns an error", async () => {
      const container = {
        getVerifyAdminCodeGateway: () => async () => ({
          validAdminCode: false,
          error: "Foo",
        }),
        logger
      };

      let response = await verifyAdminCode(container)(
        "nhs-admin@nhs.co.uk",
        "password"
      );
      expect(response.error).toBeDefined();
    });
  });
});
