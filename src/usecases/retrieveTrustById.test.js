import retrieveTrustById from "./retrieveTrustById";

describe("retrieveTrustById", () => {
  it("returns an object containing the trust", async () => {
    const container = {
      async getDb() {
        return {
          oneOrNone: jest.fn().mockReturnValue({
            id: 1,
            name: "Doggo Trust",
          }),
        };
      },
    };
    const trustId = 1;

    const { trust, error } = await retrieveTrustById(container)(trustId);

    expect(error).toBeNull();
    expect(trust).toEqual({
      id: 1,
      name: "Doggo Trust",
    });
  });

  it("returns an error object on db exception", async () => {
    const container = {
      async getDb() {
        return {
          oneOrNone: jest.fn(() => {
            throw new Error("DB Error!");
          }),
        };
      },
    };
    const trustId = 1;

    const { error } = await retrieveTrustById(container)(trustId);
    expect(error).toBeDefined();
    expect(error).toEqual("Error: DB Error!");
  });
});
