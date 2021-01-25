import retrieveDepartmentsByFacilityIdGateway from "../../../src/gateways/MsSQL/retrieveDepartmentsByFacilityId";
import mockAppContainer from "src/containers/AppContainer";

describe("retrieveDepartmentsByFacilityIdGateway", () => {
  const expectedFacilityId = 2;
  const expectedDepartments = [
    {
      id: 1,
      uuid: "uuid 1",
      name: "Ward One",
      code: "WD1",
      status: 1,
      facilityId: expectedFacilityId,
    },
    {
      id: 5,
      uuid: "uuid 5",
      name: "Ward Five",
      code: "WD5",
      status: 0,
      facilityId: expectedFacilityId,
    },
  ];
  it("retrieve departments in the db when valid", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: expectedDepartments,
      })
    );
    // Act
    const actualDepartments = await retrieveDepartmentsByFacilityIdGateway(
      mockAppContainer
    )(expectedFacilityId);
    // Assert
    expect(actualDepartments).toEqual(expectedDepartments);
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenCalledTimes(1);
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenCalledWith(
      "id",
      expect.anything(),
      expectedFacilityId
    );
    expect(mockAppContainer.getMsSqlConnPool().query).toHaveBeenCalledWith(
      "SELECT id, facility_id AS facilityId, uuid, name, code, status FROM dbo.[department] WHERE facility_id = @id"
    );
  });
  it("throws an error if msSQL is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool.mockImplementationOnce(() => undefined);
    // Act && Assert
    expect(
      async () =>
        await retrieveDepartmentsByFacilityIdGateway(mockAppContainer)(
          expectedFacilityId
        )
    ).rejects.toThrow();
  });
  it("returns undefined if id is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    // Act
    const actualDepartments = await retrieveDepartmentsByFacilityIdGateway(
      mockAppContainer
    )();
    // Assert
    expect(actualDepartments).toBeUndefined();
  });
  it("returns undefined if facility id does not exist in db", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    const idDoesNotExist = 99;
    // Act
    const actualDepartments = await retrieveDepartmentsByFacilityIdGateway(
      mockAppContainer
    )(idDoesNotExist);
    // Assert
    expect(actualDepartments).toBeUndefined();
  });
});
