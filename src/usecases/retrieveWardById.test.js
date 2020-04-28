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

    const { ward, error } = await retrieveWardById(container)(1);

    expect(error).toBeNull();
    expect(ward).toEqual({
      id: 1,
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

    const { error } = await retrieveWardById(container)(1);
    expect(error).toBeDefined();
    expect(error).toEqual("Error: DB Error!");
  });
});
