import archiveManagerByUuid from "../../src/usecases/archiveManagerByUuid";

describe("archiveManagerByUuid", () => {
  let container;
  const expectedUuid = "abc";
  const dbStub = jest.fn();
  const archiveManagerByUuidSpy = jest.fn(async () => null);
  beforeEach(() => {
    container = {
      getMsSqlConnPool: () => dbStub,
      getArchiveManagerByUuidGateway: () => archiveManagerByUuidSpy,
    };
  });
  it("returns no error if manager can be deleted", async () => {
    const { error } = await archiveManagerByUuid(container)(expectedUuid);
    expect(error).toBeNull();
    expect(archiveManagerByUuidSpy).toBeCalledWith(dbStub, expectedUuid);
  });
  it("returns an error if manager cannot be deleted", async () => {
    const archiveManagerByUuidErrorSpy = jest.fn(async () => {
      throw new Error("error");
    });

    container = {
      ...container,
      getArchiveManagerByUuidGateway: () => archiveManagerByUuidErrorSpy,
    };
    const { error } = await archiveManagerByUuid(container)(expectedUuid);
    expect(error).toEqual("There was an error deleting a manager.");
    expect(archiveManagerByUuidErrorSpy).toBeCalledWith(dbStub, expectedUuid);
  });
  it("returns an error if uuid does not exist", async () => {
    const { error } = await archiveManagerByUuid(container)();
    expect(error).toEqual("uuid is must be provided.");
  });
});
