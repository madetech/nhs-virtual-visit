import retrieveOrganizations from "../../src/usecases/retrieveOrganizations";

describe("retrieveOrganizations", () => {
  it("returns a json object containing the Organizations", async () => {
    const anySpy = jest.fn().mockReturnValue({
      organizations: [
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
      ],
      error: null,
    });

    const container = {
      getRetrieveOrganizations: () => anySpy,
    };

    const { organizations, error } = await retrieveOrganizations(container)();

    expect(error).toBeNull();
    expect(anySpy).toHaveBeenCalledWith();
    expect(organizations).toHaveLength(2);
    expect(organizations[0]).toEqual({ id: 1, name: "Test trust", status: 0 });
  });

  it("returns an error object on db exception", async () => {
    const container = {
      getRetrieveOrganizations: () =>
        jest.fn().mockReturnValue({ error: "Error: DB Error!" }),
    };

    const { error } = await retrieveOrganizations(container)();
    expect(error).toEqual("Error: DB Error!");
  });
});
