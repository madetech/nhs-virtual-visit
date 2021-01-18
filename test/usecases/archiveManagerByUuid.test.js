import archiveManagerByUuid from "../../src/usecases/archiveManagerByUuid";

describe("archiveManagerByUuid", () => {
  let container;
  const expectedUuid = "abc";
  const archiveManagerByUuidSpy = jest.fn(async () => expectedUuid);
  beforeEach(() => {
    container = {
      getArchiveManagerByUuidGateway: () => archiveManagerByUuidSpy,
    };
  });
  it("returns no error if manager can be deleted", async () => {
    const { uuid, error } = await archiveManagerByUuid(container)(expectedUuid);
    expect(error).toBeNull();
    expect(uuid).toEqual(expectedUuid);
    expect(archiveManagerByUuidSpy).toBeCalledWith(expectedUuid);
  });
  it("returns an error if manager cannot be deleted", async () => {
    const archiveManagerByUuidErrorSpy = jest.fn(async () => {
      throw new Error("error");
    });

    container = {
      ...container,
      getArchiveManagerByUuidGateway: () => archiveManagerByUuidErrorSpy,
    };
    const { uuid, error } = await archiveManagerByUuid(container)(expectedUuid);
    expect(error).toEqual("There was an error deleting a manager.");
    expect(uuid).toEqual(null);
    expect(archiveManagerByUuidErrorSpy).toBeCalledWith(expectedUuid);
  });
  it("returns an error if uuid does not exist", async () => {
    const { error } = await archiveManagerByUuid(container)();
    expect(error).toEqual("uuid is must be provided.");
  });
});
