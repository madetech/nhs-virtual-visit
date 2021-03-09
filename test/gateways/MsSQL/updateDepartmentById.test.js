import updateDepartmentByIdGateway from "../../../src/gateways/MsSQL/updateDepartmentById";
import mockAppContainer from "src/containers/AppContainer";
import bcrypt from "bcryptjs";

jest.mock("bcryptjs");
describe("updateDepartmentByIdGateway", () => {
  bcrypt.genSalt = jest.fn();
  bcrypt.hashSync.mockReturnValue("hashedPin");
  const expectedDepartmentUuid = "uuid";
  const departmentObj = {
    id: 1,
    name: "wardNameOne",
    pin: "4321"
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
      departmentObj.id
    );
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenCalledTimes(3);
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      2,
      "name",
      expect.anything(),
      departmentObj.name
    );
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      3,
      "pin",
      expect.anything(),
      "hashedPin"
    );


    expect(mockAppContainer.getMsSqlConnPool().query).toHaveBeenCalledWith(
      "UPDATE dbo.[department] SET name = @name, pin = @pin OUTPUT inserted.uuid WHERE id = @id"
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
