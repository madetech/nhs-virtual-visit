import archiveManagerByUuidGateway from "../../../src/gateways/MsSQL/archiveManagerByUuid";
import mockMssql from "src/gateways/MsSQL";

describe("archiveManagerByUuidGateway", () => {
  const expectedUuid = "abc";
  const getConnectionPoolMock = mockMssql.getConnectionPool;

  it("deletes a managers status in the db when valid", async () => {
    // Arrange
    getConnectionPoolMock().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: [{ uuid: expectedUuid }],
      })
    );
    const container = {
      getMsSqlConnPool: getConnectionPoolMock,
    };
    // Act
    const actualUuid = await archiveManagerByUuidGateway(container)(
      expectedUuid
    );
    // Assert
    expect(actualUuid).toEqual(expectedUuid);
    expect(container.getMsSqlConnPool().input).toHaveBeenCalledTimes(1);
    expect(container.getMsSqlConnPool().input).toHaveBeenCalledWith(
      "uuid",
      expect.anything(),
      expectedUuid
    );
    expect(container.getMsSqlConnPool().query).toHaveBeenCalledWith(
      "DELETE FROM dbo.[user] OUTPUT deleted.uuid WHERE uuid = @uuid"
    );
  });
  it("throws an error if database is undefined", async () => {
    // Arrange
    const container = {
      getMsSqlConnPool: undefined,
    };
    // Act && Assert
    expect(
      async () => await archiveManagerByUuidGateway(container)(expectedUuid)
    ).rejects.toThrow();
  });

  it("throws an error if uuid is undefined", async () => {
    // Arrange
    const undefinedUuid = undefined;
    getConnectionPoolMock().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    const container = {
      getMsSqlConnPool: getConnectionPoolMock,
    };
    // Act && Assert
    expect(
      async () => await archiveManagerByUuidGateway(container)(undefinedUuid)
    ).rejects.toThrowError(TypeError);
  });
});
