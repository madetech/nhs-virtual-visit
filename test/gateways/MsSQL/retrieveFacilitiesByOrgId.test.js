import retrieveFacilitiesByOrgIdGateway from "../../../src/gateways/MsSQL/retrieveFacilitiesByOrgId";
import mockMssql from "src/gateways/MsSQL";

describe("retrieveGetFacilitiesByOrgIdGateway", () => {
  const expectedOrgId = 1;
  const getConnectionPoolMock = mockMssql.getConnectionPool;
  const expectedFacilitiesWithWards = [
    {
      id: 1,
      name: "hospitalNameOne",
      code: "HN1",
      status: 0,
      wards: [{ id: 1, name: "Ward 1 for hospitalNameOne" }],
    },
    {
      id: 2,
      name: "hospitalNameTwo",
      code: "HN2",
      status: 1,
      wards: [{ id: 2, name: "Ward 1 for hospitalNameTwo" }],
    },
  ];
  const expectedFacilitiesWithoutWards = expectedFacilitiesWithWards.map(
    (facility) => ({
      id: facility.id,
      name: facility.name,
      code: facility.code,
      status: facility.status,
    })
  );

  it("retrieve facilities in the db when options args is not present", async () => {
    // Arrange
    getConnectionPoolMock().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: expectedFacilitiesWithoutWards,
      })
    );
    const container = {
      getMsSqlConnPool: getConnectionPoolMock,
    };
    // Act
    const facilities = await retrieveFacilitiesByOrgIdGateway(container)({
      orgId: expectedOrgId,
    });
    // Assert
    expect(facilities).toEqual(expectedFacilitiesWithoutWards);
    expect(container.getMsSqlConnPool().input).toHaveBeenCalledTimes(1);
    expect(container.getMsSqlConnPool().input).toHaveBeenCalledWith(
      "orgId",
      expect.anything(),
      expectedOrgId
    );
    expect(container.getMsSqlConnPool().query).toHaveBeenCalledWith(
      "SELECT name, id, code, status, uuid FROM dbo.[facility] WHERE organisation_id=@orgId"
    );
  });
  it("returns facilities and wards and when options withWards is true", async () => {
    // Arrange
    getConnectionPoolMock()
      .query.mockImplementationOnce(() =>
        Promise.resolve({ recordset: expectedFacilitiesWithoutWards })
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
      "SELECT name, id, code, status, uuid FROM dbo.[facility] WHERE organisation_id=@orgId"
    );
    for (let i = 2; i < 4; i++) {
      expect(container.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
        i,
        "facility_id",
        expect.anything(),
        expectedFacilitiesWithWards[i - 2].id
      );
      expect(container.getMsSqlConnPool().query).toHaveBeenNthCalledWith(
        i,
        "SELECT * FROM dbo.[department] WHERE facility_id = @facility_id"
      );
    }
    expect(facilities).toEqual(expectedFacilitiesWithWards);
  });
  it("throws an error if db is undefined", async () => {
    // Arrange
    const container = {
      getMsSqlConnPool: undefined,
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
    };
    const undefinedOrgId = undefined;
    // Act && Assert
    expect(
      async () =>
        await retrieveFacilitiesByOrgIdGateway(container)(undefinedOrgId)
    ).rejects.toThrowError(TypeError);
  });
});
