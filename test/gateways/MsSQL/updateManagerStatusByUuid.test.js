import updateManagerStatusByUuidGateway from "../../../src/gateways/MsSQL/updateManagerStatusByUuid";
import mockMssql from "src/gateways/MsSQL";

describe("updateManagerStatusByUuidGateway", () => {
  const expectedUuid = "abc";
  const expectedStatus = 1;
  const getConnectionPoolMock = mockMssql.getConnectionPool;

  it("updates a managers status in the db when valid", async () => {
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
    const actualUuid = await updateManagerStatusByUuidGateway(container)(
      expectedUuid,
      expectedStatus
    );
    // Assert
    expect(actualUuid).toEqual(expectedUuid);
    expect(container.getMsSqlConnPool().input).toHaveBeenCalledTimes(2);
    expect(container.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      1,
      "uuid",
      expectedUuid
    );
    expect(container.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      2,
      "status",
      expectedStatus
    );
    expect(container.getMsSqlConnPool().query).toHaveBeenCalledWith(
      "UPDATE dbo.[user] SET status = @status OUTPUT inserted.uuid WHERE uuid = @uuid"
    );
  });
  it("throws an error if db is undefined", async () => {
    // Arrange
    const container = {
      getMsSqlConnPool: undefined,
    };
    // Act && Assert
    expect(
      async () =>
        await updateManagerStatusByUuidGateway(container)(
          expectedUuid,
          expectedStatus
        )
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
      async () =>
        await updateManagerStatusByUuidGateway(container)(
          undefinedUuid,
          expectedStatus
        )
    ).rejects.toThrowError(TypeError);
  });

  it("throws an error if status is undefined", async () => {
    // Arrange
    const undefinedStatus = undefined;
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
      async () =>
        await updateManagerStatusByUuidGateway(container)(
          expectedUuid,
          undefinedStatus
        )
    ).rejects.toThrowError(TypeError);
  });
});
