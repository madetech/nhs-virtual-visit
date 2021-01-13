import createTrust from "../../../src/gateways/PostgreSQL/createTrust";

describe("createTrust", () => {
  it("creates a Trust in the db when valid", async () => {
    const oneSpy = jest.fn().mockReturnValue({ id: 1 });
    const container = {
      getDb() {
        return {
          one: oneSpy,
        };
      },
    };

    const request = {
      name: "Defoe Trust",
      adminCode: "adminCode",
      hashedPassword: "password",
      videoProvider: "whereby",
    };

    const { trustId, error } = await createTrust(container)(request);
    expect(trustId).toEqual(1);
    expect(error).toBeNull();
    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      "Defoe Trust",
      "adminCode",
      expect.anything(),
      "whereby",
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

    const { trustId, error } = await createTrust(container)({
      name: "Test Trust",
      adminCode: "adminCode",
      hashedPassword: "password",
    });
    expect(error).toEqual("Error: DB Error!");
    expect(trustId).toBeNull();
  });
});
