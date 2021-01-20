import verifyAdminCode from "../../src/usecases/verifyAdminCode";

describe("verifyAdminCode", () => {
  describe("Given a matching trust trustAdmin code", () => {
    it("Returns true with the matching trust ID", async () => {
      const container = {
        getVerifyAdminCodeGateway: () => async () => ({
          validAdminCode: true,
          error: null
        }),
      };

      let response = await verifyAdminCode(container)(
        "matching code",
        "password"
      );
      expect(response.validAdminCode).toEqual(true);
      expect(response.error).toBeNull();
    });
  });

  describe("Given a non matching trust trustAdmin code", () => {
    it("Returns false", async () => {
      const container = {
        getVerifyAdminCodeGateway: () => async () => ({
          validAdminCode: false,
          error: null
        }),
      };

      let response = await verifyAdminCode(container)("non matching code");
      expect(response.validAdminCode).toEqual(false);
    });
  });

  describe("Given a DB error", () => {
    it("Returns an error", async () => {
      const container = {
        getVerifyAdminCodeGateway: () => async () => ({
          validAdminCode: false,
          error: "Foo"
        }),
      };

      let response = await verifyAdminCode(container)("code");
      expect(response.error).toBeDefined();
    });
  });
});
