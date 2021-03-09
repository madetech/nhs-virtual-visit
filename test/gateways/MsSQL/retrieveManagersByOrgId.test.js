import retrieveManagersByOrgIdGateway from "../../../src/gateways/MsSQL/retrieveManagersByOrgId";
import mockMssql from "src/gateways/MsSQL";
import logger from "../../../logger";

describe("retrieveManagersByOrgIdGateway", () => {
  const expectedOrgId = 1;
  const expectedManagers = [
    {
      uuid: "11123",
      status: 0,
    },
    {
      uuid: "11124",
      status: 1,
    },
  ];
  const getConnectionPoolMock = mockMssql.getConnectionPool;

  it("retrieve managers recordset in the db when valid", async () => {
    // Arrange
    getConnectionPoolMock().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: expectedManagers,
      })
    );
    const container = {
      getMsSqlConnPool: getConnectionPoolMock,
      logger
    };
    // Act
    const { managers, error } = await retrieveManagersByOrgIdGateway(container)(
      expectedOrgId
    );
    // Assert
    expect(error).toBeNull();
    expect(managers).toEqual(expectedManagers);
    expect(container.getMsSqlConnPool().input).toHaveBeenCalledTimes(1);
    expect(container.getMsSqlConnPool().input).toHaveBeenCalledWith(
      "orgId",
      expect.anything(),
      expectedOrgId
    );
    expect(container.getMsSqlConnPool().query).toHaveBeenCalledWith(
      "SELECT email, uuid, status, id FROM dbo.[user] WHERE organisation_id = @orgId"
    );
  });

  it("throws an error if db is undefined", async () => {
    // Arrange
    const container = {
      getMsSqlConnPool: undefined,
      logger
    };
    // Act && Assert
    expect(
      async () => await retrieveManagersByOrgIdGateway(container)(expectedOrgId)
    ).rejects.toThrow();
  });

  it("returns undefined if orgId is undefined", async () => {
    // Arrange
    const undefinedOrgId = undefined;
    getConnectionPoolMock().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    const container = {
      getMsSqlConnPool: getConnectionPoolMock,
      logger
    };
    // Act
    const { managers, error } = await retrieveManagersByOrgIdGateway(container)(
      undefinedOrgId
    );
    // Assert
    expect(managers).toBeUndefined();
    expect(error).toBeNull();
  });
});
