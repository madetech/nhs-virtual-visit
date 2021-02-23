import retrieveDepartmentByUuidGateway from "../../../src/gateways/MsSQL/retrieveDepartmentByUuid";
import mockAppContainer from "src/containers/AppContainer";

describe("retrieveDepartmentByUuidGateway", () => {
  const expectedDepartmentUuid = "department-uuid";
  const expectedDepartment = {
    id: 1,
    uuid: expectedDepartmentUuid,
    name: "wardNameOne",
    code: "WNO",
    status: "disabled",
    facilityId: 1,
  };
  it("retrieve department in the db when valid", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: [expectedDepartment],
      })
    );
    // Act
    const actualDepartment = await retrieveDepartmentByUuidGateway(
      mockAppContainer
    )(expectedDepartmentUuid);
    // Assert
    expect(actualDepartment).toEqual(expectedDepartment);
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenCalledTimes(1);
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenCalledWith(
      "uuid",
      expect.anything(),
      expectedDepartmentUuid
    );
    expect(mockAppContainer.getMsSqlConnPool().query).toHaveBeenCalledWith(
      "SELECT pin, id, uuid, name, code, status, facility_id AS facilityId FROM dbo.[department] WHERE uuid = @uuid"
    );
  });
  it("throws an error if db is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool.mockImplementationOnce(() => undefined);

    // Act && Assert
    expect(
      async () =>
        await retrieveDepartmentByUuidGateway(mockAppContainer)(
          expectedDepartmentUuid
        )
    ).rejects.toThrow();
  });

  it("throws an error if uuid is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    // Act && Assert
    expect(
      async () =>
        await retrieveDepartmentByUuidGateway(mockAppContainer)(undefined)
    ).rejects.toThrowError(TypeError);
  });
});
