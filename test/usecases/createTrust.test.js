import createTrust from "../../src/usecases/createTrust";

describe("createTrust", () => {
  let createTrustSpy = jest.fn().mockReturnValue({ trustId: 1, error: null });

  let container;

  beforeEach(() => {
    container = {
      getCreateTrustGateway: () => createTrustSpy,
    };
  });

  it("calls createTrust when valid", async () => {
    const request = {
      name: "Defoe Trust",
      adminCode: "adminCode",
      password: "password",
      videoProvider: "whereby",
    };

    const { trustId, error } = await createTrust(container)(request);
    expect(trustId).toEqual(1);
    expect(error).toBeNull();
  });

  it("returns an error object on db exception", async () => {
    container.getCreateTrustGateway = () =>
      jest.fn().mockReturnValue({ trustId: null, error: "Error: DB Error!" });

    const { trustId, error } = await createTrust(container)({
      name: "Test Trust",
      adminCode: "adminCode",
      password: "password",
    });
    expect(error).toEqual("Error: DB Error!");
    expect(trustId).toBeNull();
  });

  it("returns an error if the password is undefined", async () => {
    container.getCreateTrustGateway = () => jest.fn();

    const request = {
      name: "Test Trust",
      adminCode: "adminCode",
    };

    const { trustId, error } = await createTrust(container)(request);

    expect(trustId).toBeNull();
    expect(error.toString()).toEqual("password is not defined");
  });

  it("returns an error if the password is empty", async () => {
    container.getCreateTrustGateway = () => jest.fn();

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
