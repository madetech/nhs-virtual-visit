import updateWard from "../../../src/gateways/PostgreSQL/updateWard";

describe("updateWard", () => {
  const request = {
    id: 10,
    status: "active",
    name: "Defoe Ward",
    hospitalId: 1,
  };

  it("updates a ward in the db when valid", async () => {
    const oneSpy = jest.fn().mockReturnValue({ id: 10 });
    const container = {
      getDb() {
        return {
          one: oneSpy,
        };
      },
    };

    const { wardId, error } = await updateWard(container)({ ward: request });
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
      getDb() {
        return {
          one: jest.fn(() => {
            throw new Error("DB Error!");
          }),
        };
      },
    };
    const { wardId, error } = await updateWard(container)({ ward: request });
    expect(error).toEqual("Error: DB Error!");
    expect(wardId).toEqual(null);
  });
});
