import archiveManagerByUuidGateway from "../../../src/gateways/MsSQL/archiveManagerByUuid";
import mockMssql from "mssql";

describe("archiveManagerByUuidGateway", () => {
  const expectedUuid = "abc";
  let dbSpy;
  beforeEach(() => {
    dbSpy = mockMssql.getConnectionPool();
    dbSpy.query.mockImplementation(() =>
      Promise.resolve({
        recordset: [{ uuid: expectedUuid }],
      })
    );
  });
  it("deletes a managers status in the db when valid", async () => {
    // Act
    const actualUuid = await archiveManagerByUuidGateway(dbSpy, expectedUuid);
    // Assert
    expect(actualUuid).toEqual(expectedUuid);
    expect(dbSpy.input).toHaveBeenCalledTimes(1);
    expect(dbSpy.input).toHaveBeenCalledWith("uuid", expectedUuid);
    expect(dbSpy.query).toHaveBeenCalledWith(
      "DELETE FROM dbo.[user] OUTPUT deleted.uuid WHERE uuid = @uuid"
    );
  });
  it("throws an error if database is undefined", async () => {
    // Arrange
    const dbStub = undefined;

    // Act && Assert
    expect(
      async () => await archiveManagerByUuidGateway(dbStub, expectedUuid)
    ).rejects.toThrow();
  });

  it("throws an error if uuid is undefined", async () => {
    // Arrange
    const undefinedUuid = undefined;
    dbSpy.query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    // Act && Assert
    expect(
      async () => await archiveManagerByUuidGateway(dbSpy, undefinedUuid)
    ).rejects.toThrowError(TypeError);
  });
});
