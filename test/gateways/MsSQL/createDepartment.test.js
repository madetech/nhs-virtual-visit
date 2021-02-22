import createDepartment from "../../../src/gateways/MsSQL/createDepartment";
import mockAppContainer from "src/containers/AppContainer";
import bcrypt from "bcryptjs";

jest.mock("bcryptjs");
describe("createDepartment", () => {
  bcrypt.genSalt = jest.fn();
  bcrypt.hashSync.mockReturnValue("hashedPin");
  const expectedDepartmentUuid = "uuid";
  const expectedArgs = {
    name: "Defoe Ward",
    code: "WardCode",
    facilityId: "1",
    pin: "1234",
    createdBy: 10,
  };

  it("retrieve department recordset in the db when valid", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: [{ uuid: expectedDepartmentUuid }],
      })
    );
    // Act
    const actualDepartmentUuid = await createDepartment(mockAppContainer)(
      expectedArgs
    );
    // Assert
    expect(actualDepartmentUuid).toEqual(expectedDepartmentUuid);
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenCalledTimes(5);
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      1,
      "name",
      expect.anything(),
      expectedArgs.name
    );
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      2,
      "facilityId",
      expect.anything(),
      expectedArgs.facilityId
    );
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      3,
      "code",
      expect.anything(),
      expectedArgs.code
    );
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      4,
      "pin",
      expect.anything(),
      "hashedPin"
    );
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      5,
      "createdBy",
      expect.anything(),
      expectedArgs.createdBy
    );
    expect(mockAppContainer.getMsSqlConnPool().query).toHaveBeenCalledWith(
      "INSERT INTO dbo.[department] ([name], [facility_id], [code], [pin], [created_by]) OUTPUT inserted.uuid VALUES (@name, @facilityId, @code, @pin, @createdBy)"
    );
  });
  it("throws an error if db is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool.mockImplementationOnce(() => undefined);
    // Act && Assert
    expect(
      async () => await createDepartment(mockAppContainer)(expectedArgs)
    ).rejects.toThrow();
  });

  it("throws an error if createdBy is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    // Act && Assert
    expect(
      async () =>
        await createDepartment(mockAppContainer)({
          ...expectedArgs,
          createdBy: undefined,
        })
    ).rejects.toThrow();
  });
  it("throws an error if name is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    // Act && Assert
    expect(
      async () =>
        await createDepartment(mockAppContainer)({
          ...expectedArgs,
          name: undefined,
        })
    ).rejects.toThrow();
  });
  it("throws an error if facility id is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    // Act && Assert
    expect(
      async () =>
        await createDepartment(mockAppContainer)({
          ...expectedArgs,
          facilityId: undefined,
        })
    ).rejects.toThrow();
  });
  it("throws an error if department code is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    // Act && Assert
    expect(
      async () =>
        await createDepartment(mockAppContainer)({
          ...expectedArgs,
          code: undefined,
        })
    ).rejects.toThrow();
  });
  it("throws an error if pin is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    // Act && Assert
    expect(
      async () =>
        await createDepartment(mockAppContainer)({
          ...expectedArgs,
          pin: undefined,
        })
    ).rejects.toThrow();
  });
});
