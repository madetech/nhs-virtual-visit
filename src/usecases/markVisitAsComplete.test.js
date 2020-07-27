import markVisitAsComplete from "./markVisitAsComplete";

describe("markVisitAsComplete", () => {
  it("returns an error if no id is provided", async () => {
    const { id, error } = await markVisitAsComplete({ async getDb() {} })({
      wardId: 1,
    });

    expect(error).toEqual("An id must be provided.");
    expect(id).toBeNull();
  });

  it("returns an error if no wardId is provided", async () => {
    const { id, error } = await markVisitAsComplete({ async getDb() {} })({
      id: 1,
    });

    expect(error).toEqual("A wardId must be provided.");
    expect(id).toBeNull();
  });

  it("returns any errors thrown by the database query", async () => {
    const container = {
      async getDb() {
        return {
          one: jest.fn(() => {
            throw "failure";
          }),
        };
      },
    };

    const { id, error } = await markVisitAsComplete(container)({
      id: 1,
      wardId: 1,
    });

    expect(error).toEqual("failure");
    expect(id).toBeNull();
  });
});
