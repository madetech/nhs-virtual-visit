import createWard from "./createWard";

describe("createWard", () => {
  it("creates a ward in the db when valid", async () => {
    const oneSpy = jest.fn().mockReturnValue({ id: 10 });
    const container = {
      async getDb() {
        return {
          one: oneSpy,
        };
      },
    };

    const request = {
      name: "Defoe Ward",
      hospitalName: "Test Hospital",
    };

    const { wardId, error } = await createWard(container)(request);

    expect(wardId).toEqual(10);
    expect(error).toBeNull();

    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      request.name,
      request.hospitalName,
    ]);
  });
});
