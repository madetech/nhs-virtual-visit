import verifyAdminCode from "../../src/usecases/verifyAdminCode";

describe("verifyAdminCode", () => {
  describe("Given a matching trust trustAdmin code", () => {
    it("Returns true with the matching trust ID", async () => {
      const container = {
        getDb: async () => ({
          any: jest.fn(async () => [
            {
              id: 1,
              code: "matching code",
              password:
                "$2y$04$vOxbx/0uUTg6BbDXtXqhQO4zwYh3jfkj6bXi06hlWfM.UlOR9QKv2", // "password" hashed
            },
          ]),
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
