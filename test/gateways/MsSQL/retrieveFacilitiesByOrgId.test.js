import retrieveFacilitiesByOrgIdGateway from "../../../src/gateways/MsSQL/retrieveFacilitiesByOrgId";
import mockMssql from "src/gateways/MsSQL";
import logger from "../../../logger"

describe("retrieveGetFacilitiesByOrgIdGateway", () => {
  const expectedOrgId = 1;
  const getConnectionPoolMock = mockMssql.getConnectionPool;
  const expectedFacilitiesWithDepartments = [
    {
      id: 1,
      uuid: "uuid1",
      name: "hospitalNameOne",
      code: "HN1",
      status: 0,
      departments: [{ id: 1, name: "Ward 1 for hospitalNameOne" }],
    },
    {
      id: 2,
      uuid: "uuid2",
      name: "hospitalNameTwo",
      code: "HN2",
      status: 1,
      departments: [{ id: 2, name: "Ward 1 for hospitalNameTwo" }],
    },
  ];
  const expectedFacilitiesWithoutDepartments = expectedFacilitiesWithDepartments.map(
    (facility) => ({
      id: facility.id,
      uuid: facility.uuid,
      name: facility.name,
      code: facility.code,
      status: facility.status,
    })
  );

  it("retrieve facilities in the db when options args is not present", async () => {
    // Arrange
    getConnectionPoolMock().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: expectedFacilitiesWithoutDepartments,
      })
    );
    const container = {
      getMsSqlConnPool: getConnectionPoolMock,
      logger
    };
    // Act
    const facilities = await retrieveFacilitiesByOrgIdGateway(container)({
      orgId: expectedOrgId,
    });
    // Assert
    expect(facilities).toEqual(expectedFacilitiesWithoutDepartments);
    expect(container.getMsSqlConnPool().input).toHaveBeenCalledTimes(1);
    expect(container.getMsSqlConnPool().input).toHaveBeenCalledWith(
      "orgId",
      expect.anything(),
      expectedOrgId
    );
    expect(container.getMsSqlConnPool().query).toHaveBeenCalledWith(
      "SELECT name, id, code, status, uuid FROM dbo.[facility] WHERE organisation_id=@orgId ORDER BY name"
    );
  });
  it("returns facilities and wards and when options withWards is true", async () => {
    // Arrange
    getConnectionPoolMock()
      .query.mockImplementationOnce(() =>
        Promise.resolve({ recordset: expectedFacilitiesWithoutDepartments })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          recordset: [{ id: 1, name: "Ward 1 for hospitalNameOne" }],
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          recordset: [{ id: 2, name: "Ward 1 for hospitalNameTwo" }],
        })
      );

    const container = {
      getMsSqlConnPool: getConnectionPoolMock,
    };
    // Act
    const facilities = await retrieveFacilitiesByOrgIdGateway(container)({
      orgId: expectedOrgId,
      options: { withWards: true },
    });
    // Assert
    expect(container.getMsSqlConnPool).toHaveBeenCalledTimes(2);
    expect(container.getMsSqlConnPool().input).toHaveBeenCalledTimes(3);
    expect(container.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      1,
      "orgId",
      expect.anything(),
      expectedOrgId
    );
    expect(container.getMsSqlConnPool().query).toHaveBeenCalledTimes(3);
    expect(container.getMsSqlConnPool().query).toHaveBeenNthCalledWith(
      1,
      "SELECT name, id, code, status, uuid FROM dbo.[facility] WHERE organisation_id=@orgId ORDER BY name"
    );
    for (let i = 2; i < 4; i++) {
      expect(container.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
        i,
        "facility_id",
        expect.anything(),
        expectedFacilitiesWithDepartments[i - 2].id
      );
      expect(container.getMsSqlConnPool().query).toHaveBeenNthCalledWith(
        i,
        "SELECT * FROM dbo.[department] WHERE facility_id = @facility_id ORDER BY name"
      );
    }
    expect(facilities).toEqual(expectedFacilitiesWithDepartments);
  });
  it("throws an error if db is undefined", async () => {
    // Arrange
    const container = {
      getMsSqlConnPool: undefined,
      logger
    };
    // Act && Assert
    expect(
      async () =>
        await retrieveFacilitiesByOrgIdGateway(container)({
          orgId: expectedOrgId,
        })
    ).rejects.toThrow();
  });

  it("throws an error if orgId is undefined", async () => {
    // Arrange
    getConnectionPoolMock().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    const container = {
      getMsSqlConnPool: getConnectionPoolMock,
      logger
    };
    const undefinedOrgId = undefined;
    // Act && Assert
    expect(
      async () =>
        await retrieveFacilitiesByOrgIdGateway(container)(undefinedOrgId)
    ).rejects.toThrowError(TypeError);
  });
});
