import createWard from "../../../src/gateways/PostgreSQL/createWard";

describe("createWard", () => {
  it("creates a ward in the db when valid", async () => {
    const oneSpy = jest.fn().mockReturnValue({ id: 10 });
    const container = {
      getDb() {
        return {
          one: oneSpy,
        };
      },
    };

    const request = {
      name: "Defoe Ward",
      code: "WardCode",
      trustId: "1",
      pin: "1234",
      hospitalId: "1",
    };

    const { wardId, error } = await createWard(container)({ ward: request });

    expect(wardId).toEqual(10);
    expect(error).toBeNull();

    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      request.name,
      request.code,
      request.trustId,
      request.hospitalId,
      request.pin,
    ]);
  });
});
