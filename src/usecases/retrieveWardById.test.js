import retrieveWardById from "./retrieveWardById";

describe("retrieveWardById", () => {
  it("returns a json object containing the call", async () => {
    const container = {
      async getDb() {
        return {
          oneOrNone: jest.fn().mockReturnValue({
            id: 1,
            name: "Defoe Ward",
            hospital_name: "Test Hospital",
          }),
        };
      },
    };

    const wardId = 1;
    const trustId = 1;

    const { ward, error } = await retrieveWardById(container)(wardId, trustId);

    expect(error).toBeNull();
    expect(ward).toEqual({
      id: wardId,
      name: "Defoe Ward",
      hospitalName: "Test Hospital",
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

    const { error } = await retrieveWardById(container)(1, 1);
    expect(error).toBeDefined();
    expect(error).toEqual("Error: DB Error!");
  });
});
