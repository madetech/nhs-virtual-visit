import updateWard from "../../src/usecases/updateWard";

describe("updateWard", () => {
  it("updates a ward in the db when valid", async () => {
    const oneSpy = jest.fn().mockReturnValue({ id: 10 });
    const container = {
      async getDb() {
        return {
          one: oneSpy,
        };
      },
    };
    const request = {
      id: 10,
      status: "active",
      name: "Defoe Ward",
      hospitalId: 1,
    };
    const { wardId, error } = await updateWard(container)(request);
    expect(wardId).toEqual(10);
    expect(error).toBeNull();
    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      request.name,
      request.hospitalId,
      request.status,
      request.id,
    ]);
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
    const { wardId, error } = await updateWard(container)("rubbishRequest");
    expect(error).toEqual("Error: DB Error!");
    expect(wardId).toEqual(null);
  });
});
