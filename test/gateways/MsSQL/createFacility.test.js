import createFacility from "../../../src/gateways/MsSQL/createFacility";
import mockMssql from "src/gateways/MsSQL";

describe("createFacility", () => {
  const expectedFacilityId = 12;
  const expectedArgs = {
    name: "Test 1 Hospital",
    orgId: 10,
    code: "TH1",
    userId: 5,
  };
  const getConnectionPoolMock = mockMssql.getConnectionPool;

  it("retrieve managers recordset in the db when valid", async () => {
    // Arrange
    getConnectionPoolMock().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: [{ id: expectedFacilityId }],
      })
    );
    const container = {
      getMsSqlConnPool: getConnectionPoolMock,
    };
    // Act
    const actualFacilityId = await createFacility(container)(expectedArgs);
    // Assert
    expect(actualFacilityId).toEqual(expectedFacilityId);
    expect(container.getMsSqlConnPool().input).toHaveBeenCalledTimes(4);
    expect(container.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      1,
      "name",
      expect.anything(),
      expectedArgs.name
    );
    expect(container.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      2,
      "orgId",
      expect.anything(),
      expectedArgs.orgId
    );
    expect(container.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      3,
      "code",
      expect.anything(),
      expectedArgs.code
    );
    expect(container.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      4,
      "userId",
      expect.anything(),
      expectedArgs.userId
    );
    expect(container.getMsSqlConnPool().query).toHaveBeenCalledWith(
      "INSERT INTO dbo.[facility] ([name], [organisation_id], [code], [created_by]) OUTPUT inserted.id VALUES (@name, @orgId, @code, @userId)"
    );
  });
  it("throws an error if db is undefined", async () => {
    // Arrange
    const container = {
      getMsSqlConnPool: undefined,
    };
    // Act && Assert
    expect(
      async () => await createFacility(container)(expectedArgs)
    ).rejects.toThrow();
  });

  it("throws an error if user id is undefined", async () => {
    // Arrange
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
        await createFacility(container)({ ...expectedArgs, userId: undefined })
    ).rejects.toThrow();
  });
  it("throws an error if name is undefined", async () => {
    // Arrange
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
        await createFacility(container)({ ...expectedArgs, name: undefined })
    ).rejects.toThrow();
  });
  it("throws an error if organisation id is undefined", async () => {
    // Arrange
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
        await createFacility(container)({ ...expectedArgs, orgId: undefined })
    ).rejects.toThrow();
  });
  it("throws an error if facility code is undefined", async () => {
    // Arrange
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
        await createFacility(container)({ ...expectedArgs, code: undefined })
    ).rejects.toThrow();
  });
});
