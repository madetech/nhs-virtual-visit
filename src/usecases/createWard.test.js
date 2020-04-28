import createWard from "./createWard";

describe("createWard", () => {
  it("creates a ward in the db when valid", async () => {
    const oneSpy = jest.fn().mockReturnValue(10);
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

    const resultingId = await createWard(container)(request);

    expect(resultingId).toEqual(10);

    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      request.name,
      request.hospitalName,
    ]);
  });
});
