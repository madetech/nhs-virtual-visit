import archiveDepartmentByIdGateway from "../../../src/gateways/MsSQL/archiveDepartmentById";
import mockAppContainer from "src/containers/AppContainer";

describe("archiveDepartmentByIdGateway", () => {
  const id = 1;
  const expectedDepartmentUuid = "uuid";

  it("updates department in the db when valid", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: [{ uuid: expectedDepartmentUuid }],
      })
    );
    // Act
    const uuid = await archiveDepartmentByIdGateway(mockAppContainer)(id);
    // Assert
    expect(uuid).toEqual(expectedDepartmentUuid);
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenCalledWith(
      "id",
      expect.anything(),
      id
    );
    expect(mockAppContainer.getMsSqlConnPool().query).toHaveBeenCalledWith(
      "UPDATE dbo.[department] SET status = 0 OUTPUT inserted.uuid WHERE id = @id"
    );
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
      async () => await archiveDepartmentByIdGateway(mockAppContainer)()
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
      async () => await archiveDepartmentByIdGateway(mockAppContainer)(id)
    ).rejects.toThrowError(TypeError);
  });
  it("throws an error if db is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool.mockImplementationOnce(() => undefined);

    // Act && Assert
    expect(
      async () => await archiveDepartmentByIdGateway(mockAppContainer)(id)
    ).rejects.toThrow();
  });
});
