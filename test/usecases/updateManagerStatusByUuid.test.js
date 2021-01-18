import updateManagerStatusByUuid from "../../src/usecases/updateManagerStatusByUuid";

describe("updateManagerStatusByUuid", () => {
  let container;
  const expectedUuid = "abc";
  const expectedStatus = "status";
  const updateManagerStatusByUuidSpy = jest.fn(async () => expectedUuid);

  beforeEach(() => {
    container = {
      getUpdateManagerStatusByUuidGateway: () => updateManagerStatusByUuidSpy,
    };
  });

  it("returns no error if manager status can be updated", async () => {
    const { uuid, error } = await updateManagerStatusByUuid(container)({
      uuid: expectedUuid,
      status: expectedStatus,
    });
    expect(error).toBeNull();
    expect(uuid).toEqual(expectedUuid);
    expect(updateManagerStatusByUuidSpy).toBeCalledWith(
      expectedUuid,
      expectedStatus
    );
  });

  it("returns an error if manager status cannot be updated", async () => {
    const updateManagerStatusByUuidErrorSpy = jest.fn(async () => {
      throw new Error("error");
    });

    container = {
      ...container,
      getUpdateManagerStatusByUuidGateway: () =>
        updateManagerStatusByUuidErrorSpy,
    };
    const { uuid, error } = await updateManagerStatusByUuid(container)({
      uuid: expectedUuid,
      status: expectedStatus,
    });
    expect(error).toEqual("There was an error updating a manager.");
    expect(uuid).toBeNull();
    expect(updateManagerStatusByUuidErrorSpy).toBeCalledWith(
      expectedUuid,
      expectedStatus
    );
  });

  it("returns an error if uuid does not exist", async () => {
    const { uuid, error } = await updateManagerStatusByUuid(container)({
      status: expectedStatus,
    });
    expect(error).toEqual("uuid must be provided.");
    expect(uuid).toBeNull();
  });

  it("returns an error if status does not exist", async () => {
    const { uuid, error } = await updateManagerStatusByUuid(container)({
      uuid: expectedUuid,
    });
    expect(error).toEqual("status must be provided.");
    expect(uuid).toEqual(expectedUuid);
  });
});
