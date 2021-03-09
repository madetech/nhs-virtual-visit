import retrieveManagerByUuid from "../../src/usecases/retrieveManagerByUuid";
import logger from "../../logger";

describe("retrieveManagerByUuid", () => {
  let container;
  const expectedUuid = "abc";
  const expectedManager = {
    uuid: expectedUuid,
    email: "test@nhs.co.uk",
    organisation_id: 1,
    status: 1,
  };
  const retrieveManagerByUuidSpy = jest.fn(async () => expectedManager);
  beforeEach(() => {
    container = {
      getRetrieveManagerByUuidGateway: () => retrieveManagerByUuidSpy,
      logger
    };
  });
  it("returns no error if manager can be retrieved", async () => {
    const { manager, error } = await retrieveManagerByUuid(container)(
      expectedUuid
    );
    expect(error).toBeNull();
    expect(manager).toEqual({ ...expectedManager, status: "active" });
    expect(retrieveManagerByUuidSpy).toBeCalledWith(expectedUuid);
  });
  it("returns status of active if manager status retrieved is 1", async () => {
    const { manager, error } = await retrieveManagerByUuid(container)(
      expectedUuid
    );
    expect(error).toBeNull();
    expect(manager).toEqual({ ...expectedManager, status: "active" });
    expect(retrieveManagerByUuidSpy).toBeCalledWith(expectedUuid);
  });
  it("returns status of disabled if manager status retrieved is 0", async () => {
    const retrieveManagerStatusCheckByUuidSpy = jest.fn(async () => ({
      ...expectedManager,
      status: 0,
    }));
    container = {
      ...container,
      getRetrieveManagerByUuidGateway: () =>
        retrieveManagerStatusCheckByUuidSpy,
    };
    const { manager, error } = await retrieveManagerByUuid(container)(
      expectedUuid
    );
    expect(error).toBeNull();
    expect(manager).toEqual({ ...expectedManager, status: "disabled" });
    expect(retrieveManagerStatusCheckByUuidSpy).toBeCalledWith(expectedUuid);
  });
  it("returns an error if manager cannot be deleted", async () => {
    const retrieveManagerByUuidErrorSpy = jest.fn(async () => {
      throw new Error("error");
    });

    container = {
      ...container,
      getRetrieveManagerByUuidGateway: () => retrieveManagerByUuidErrorSpy,
    };
    const { manager, error } = await retrieveManagerByUuid(container)(
      expectedUuid
    );
    expect(error).toEqual("There was an error retrieving a manager.");
    expect(manager).toBeNull();
    expect(retrieveManagerByUuidErrorSpy).toBeCalledWith(expectedUuid);
  });
  it("returns an error if uuid does not exist", async () => {
    const { manager, error } = await retrieveManagerByUuid(container)();
    expect(error).toEqual("uuid must be provided.");
    expect(manager).toBeNull();
  });
});
