import createOrganizationList from "./createOrganizationList";

describe("createOrganizationList", () => {
  it("create an Organization", async () => {
    const oneSpy = jest.fn().mockReturnValue({ id: 1 });
    const container = {
      async getDb() {
        return {
          one: oneSpy,
        };
      },
    };

    const request = { name: "Test Trust" };

    const { organizationId, error } = await createOrganizationList(container)(
      request
    );
    expect(organizationId).toEqual(1);
    expect(error).toBeNull();
    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), ["Test Trust"]);
  });

  it("returns an error object on db exception", async () => {
    const container = {
      async getDb() {
        return {
          one: jest.fn(() => {
            throw new Error("DB Error!");
          }),
        };
      },
    };

    const { organizationId, error } = await createOrganizationList(container)({
      name: "Test Trust",
    });

    expect(error).toEqual("Error: DB Error!");
    expect(organizationId).toBeNull();
  });
});
