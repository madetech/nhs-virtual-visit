import createTrust from "./createTrust";

describe("createTrust", () => {
  it("creates a Trust in the db when valid", async () => {
    const oneSpy = jest.fn().mockReturnValue({ id: 1 });
    const container = {
      async getDb() {
        return {
          one: oneSpy,
        };
      },
    };

    const request = {
      name: "Defoe Trust",
      adminCode: "adminCode",
      password: "password",
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
      async getDb() {
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
      password: "password",
    });
    expect(error).toEqual("Error: DB Error!");
    expect(trustId).toBeNull();
  });

  it("returns an error if the password is undefined", async () => {
    const container = {
      async getDb() {},
    };

    const request = {
      name: "Test Trust",
      adminCode: "adminCode",
    };

    const { trustId, error } = await createTrust(container)(request);

    expect(trustId).toBeNull();
    expect(error.toString()).toEqual("password is not defined");
  });

  it("returns an error if the password is empty", async () => {
    const container = {
      async getDb() {},
    };

    const request = {
      name: "Test Trust",
      adminCode: "adminCode",
      password: "",
    };

    const { trustId, error } = await createTrust(container)(request);

    expect(trustId).toBeNull();
    expect(error.toString()).toEqual("password is not defined");
  });
});
