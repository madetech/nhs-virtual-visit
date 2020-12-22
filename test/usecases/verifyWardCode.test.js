import verifyWardCode from "../../src/usecases/verifyWardCode";

describe("verifyWardCode", () => {
  describe("Given a matching ward code", () => {
    it("Calls the findWardByCode gateway", async () => {
      const findWardByCodeGateway = jest.fn(async () => ({
        wardId: 1,
        wardCode: "14p+",
        trustId: 1,
      }));
      const container = {
        getFindWardByCodeGateway: () => findWardByCodeGateway,
      };

      await verifyWardCode(container)("14p+");
      expect(findWardByCodeGateway).toHaveBeenCalledWith("14p+");
    });

    it("Returns true with the matching ward ID", async () => {
      const findWardByCodeGateway = jest.fn(async () => ({
        wardId: 1,
        wardCode: "MEOW",
        trustId: 1,
      }));
      const container = {
        getFindWardByCodeGateway: () => findWardByCodeGateway,
      };

      let response = await verifyWardCode(container)("MEOW");
      expect(response.validWardCode).toEqual(true);
      expect(response.ward).toEqual({
        id: 1,
        code: "MEOW",
        trustId: 1,
      });
    });
  });

  describe("Given a non matching ward code", () => {
    it("Returns false", async () => {
      const container = {
        getFindWardByCodeGateway: async () => ({
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
        getFindWardByCodeGateway: () => async () => {
          throw new Error("DB Error!");
        },
      };

      let response = await verifyWardCode(container)("MEOW");
      expect(response.error).toBeDefined();
    });
  });
});
