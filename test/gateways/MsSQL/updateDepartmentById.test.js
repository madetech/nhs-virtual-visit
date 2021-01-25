import updateDepartmentByIdGateway from "../../../src/gateways/MsSQL/updateDepartmentById";
import mockAppContainer from "src/containers/AppContainer";

describe("updateDepartmentByIdGateway", () => {
  const expectedDepartmentUuid = "uuid";
  const departmentObj = {
    id: 1,
    name: "wardNameOne",
    status: 0,
  };
  it("updates department in the db when valid", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: [{ uuid: expectedDepartmentUuid }],
      })
    );
    // Act
    const uuid = await updateDepartmentByIdGateway(mockAppContainer)(
      departmentObj
    );
    // Assert
    expect(uuid).toEqual(expectedDepartmentUuid);
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      1,
      "id",
      expect.anything(),
      1
    );
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenCalledTimes(3);
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      2,
      "status",
      expect.anything(),
      0
    );
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      3,
      "name",
      expect.anything(),
      "wardNameOne"
    );

    expect(mockAppContainer.getMsSqlConnPool().query).toHaveBeenCalledWith(
      "UPDATE dbo.[department] SET status = @status, name = @name OUTPUT inserted.uuid WHERE id = @id"
    );
  });
  it("throws an error if db is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool.mockImplementationOnce(() => undefined);

    // Act && Assert
    expect(
      async () =>
        await updateDepartmentByIdGateway(mockAppContainer)(departmentObj)
    ).rejects.toThrow();
  });

  it("throws an error if id is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    // Act && Assert
    expect(
      async () => await updateDepartmentByIdGateway(mockAppContainer)(undefined)
    ).rejects.toThrowError(TypeError);
  });
  it("throws an error if id does not exist in database", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    // Act && Assert
    expect(
      async () =>
        await updateDepartmentByIdGateway(mockAppContainer)(departmentObj)
    ).rejects.toThrowError(TypeError);
  });
});
