import verifyTrustAdminCode from "./verifyTrustAdminCode";

describe("verifyTrustAdminCode", () => {
  describe("Given a matching trust trustAdmin code", () => {
    it("Returns true with the matching trust ID", async () => {
      const container = {
        getDb: async () => ({
          any: jest.fn(async () => [
            {
              id: 1,
              name: "Trust one",
              admin_code: "MEOW",
            },
          ]),
        }),
      };

      let response = await verifyTrustAdminCode(container)("MEOW");
      expect(response.validTrustAdminCode).toEqual(true);
      expect(response.trust).toEqual({
        id: 1,
      });
    });
  });

  describe("Given a non matching trust trustAdmin code", () => {
    it("Returns false", async () => {
      const container = {
        getDb: async () => ({
          any: jest.fn(async () => []),
        }),
      };

      let response = await verifyTrustAdminCode(container)("WOOF");
      expect(response.validTrustAdminCode).toEqual(false);
    });
  });

  describe("Given a DB error", () => {
    it("Returns an error", async () => {
      const container = {
        async getDb() {
          return {
            any: jest.fn(() => {
              throw new Error("DB Error!");
            }),
          };
        },
      };

      let response = await verifyTrustAdminCode(container)("MEOW");
      expect(response.error).toBeDefined();
    });
  });
});
