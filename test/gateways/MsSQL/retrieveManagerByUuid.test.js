import retrieveManagerByUuidGateway from "../../../src/gateways/MsSQL/retrieveManagerByUuid";
import mockMssql from "src/gateways/MsSQL";

describe("retrieveManagerByUuidGateway", () => {
  const expectedUuid = "12SD";
  const expectedManager = {
    uuid: expectedUuid,
    status: 1,
  };
  const getConnectionPoolMock = mockMssql.getConnectionPool;

  it("retrieve manager in the db when valid", async () => {
    // Arrange
    getConnectionPoolMock().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: [expectedManager],
      })
    );
    const container = {
      getMsSqlConnPool: getConnectionPoolMock,
    };
    // Act
    const actualManager = await retrieveManagerByUuidGateway(container)(
      expectedUuid
    );
    // Assert
    expect(actualManager).toEqual(expectedManager);
    expect(container.getMsSqlConnPool().input).toHaveBeenCalledTimes(1);
    expect(container.getMsSqlConnPool().input).toHaveBeenCalledWith(
      "uuid",
      expectedUuid
    );
    expect(container.getMsSqlConnPool().query).toHaveBeenCalledWith(
      "SELECT email, organisation_id, uuid, status FROM dbo.[user] WHERE uuid = @uuid"
    );
  });
  it("throws an error if db is undefined", async () => {
    // Arrange
    const container = {
      getMsSqlConnPool: undefined,
    };
    // Act && Assert
    expect(
      async () => await retrieveManagerByUuidGateway(container)(expectedUuid)
    ).rejects.toThrow();
  });

  it("throws an error if uuid is undefined", async () => {
    // Arrange
    getConnectionPoolMock().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    const container = {
      getMsSqlConnPool: getConnectionPoolMock,
    };
    const undefinedUuid = undefined;
    // Act && Assert
    expect(
      async () => await retrieveManagerByUuidGateway(container)(undefinedUuid)
    ).rejects.toThrowError(TypeError);
  });
});
