import verifyAdminCode from "./verifyAdminCode";

describe("verifyAdminCode", () => {
  describe("Given a matching trust trustAdmin code", () => {
    it("Returns true with the matching trust ID", async () => {
      const container = {
        getDb: async () => ({
          any: jest.fn(async () => [
            {
              id: 1,
              code: "matching code",
            },
          ]),
        }),
      };

      let response = await verifyAdminCode(container)("matching code");
      expect(response.validAdminCode).toEqual(true);
      expect(response.error).toBeNull;
    });
  });

  describe("Given a non matching trust trustAdmin code", () => {
    it("Returns false", async () => {
      const container = {
        getDb: async () => ({
          any: jest.fn(async () => []),
        }),
      };

      let response = await verifyAdminCode(container)("non matching code");
      expect(response.validAdminCode).toEqual(false);
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

      let response = await verifyAdminCode(container)("code");
      expect(response.error).toBeDefined();
    });
  });
});
