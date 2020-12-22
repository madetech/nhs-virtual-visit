import retrieveOrganizations from "./retrieveOrganizations";

describe("retrieveOrganizations", () => {
  it("returns a json object containing the Organizations", async () => {
    const anySpy = jest.fn(() => [
      {
        id: 1,
        name: "Test trust",
        status: 0,
      },
      {
        id: 2,
        name: "Test trust 2",
        status: 0,
      },
    ]);

    const container = {
      async getDb() {
        return { any: anySpy };
      },
    };

    const { organizations, error } = await retrieveOrganizations(container)();

    expect(error).toBeNull();
    expect(anySpy).toHaveBeenCalledWith(expect.anything());
    expect(organizations).toHaveLength(2);
    expect(organizations[0]).toEqual({ id: 1, name: "Test trust", status: 0 });
  });

  it("returns an error object on db exception", async () => {
    const container = {
      async getDb() {
        return {
          any: jest.fn(() => {
            throw new Error("DB Error!");
          }),
        };
      },
    };

    const { error } = await retrieveOrganizations(container)();
    expect(error).toEqual("Error: DB Error!");
  });
});
