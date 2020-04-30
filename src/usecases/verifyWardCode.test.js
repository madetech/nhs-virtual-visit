import verifyWardCode from "./verifyWardCode";

describe("verifyWardCode", () => {
  describe("Given a matching ward code", () => {
    it("Returns true", async () => {
      const container = {
        getDb: async () => ({
          any: jest.fn(async () => [
            {
              id: 1,
              name: "Ward name",
              hospital_name: "London Meowdical Hospital",
              ward_code: "MEOW",
            },
          ]),
        }),
      };

      let response = await verifyWardCode(container)("MEOW");
      expect(response.validWardCode).toEqual(true);
    });
  });

  describe("Given a non matching ward code", () => {
    it("Returns false", async () => {
      const container = {
        getDb: async () => ({
          any: jest.fn(async () => []),
        }),
      };

      let response = await verifyWardCode(container)("WOOF");
      expect(response.validWardCode).toEqual(false);
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

      let response = await verifyWardCode(container)("MEOW");
      expect(response.error).toBeDefined();
    });
  });
});
