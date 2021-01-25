import createFacility from "../../../src/gateways/MsSQL/createFacility";
import mockAppContainer from "src/containers/AppContainer";

describe("createFacility", () => {
  const expectedFacilityUuid = "uuid";
  const expectedArgs = {
    name: "Test 1 Hospital",
    orgId: 10,
    code: "TH1",
    createdBy: 5,
  };

  it("retrieve managers recordset in the db when valid", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: [{ uuid: expectedFacilityUuid }],
      })
    );
    // Act
    const actualFacilityUuid = await createFacility(mockAppContainer)(
      expectedArgs
    );
    // Assert
    expect(actualFacilityUuid).toEqual(expectedFacilityUuid);
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenCalledTimes(4);
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      1,
      "name",
      expect.anything(),
      expectedArgs.name
    );
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      2,
      "orgId",
      expect.anything(),
      expectedArgs.orgId
    );
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      3,
      "code",
      expect.anything(),
      expectedArgs.code
    );
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      4,
      "createdBy",
      expect.anything(),
      expectedArgs.createdBy
    );
    expect(mockAppContainer.getMsSqlConnPool().query).toHaveBeenCalledWith(
      "INSERT INTO dbo.[facility] ([name], [organisation_id], [code], [created_by]) OUTPUT inserted.uuid VALUES (@name, @orgId, @code, @createdBy)"
    );
  });
  it("throws an error if db is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool.mockImplementationOnce(() => undefined);
    // Act && Assert
    expect(
      async () => await createFacility(mockAppContainer)(expectedArgs)
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
        await createFacility(mockAppContainer)({
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
        await createFacility(mockAppContainer)({
          ...expectedArgs,
          name: undefined,
        })
    ).rejects.toThrow();
  });
  it("throws an error if organisation id is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    // Act && Assert
    expect(
      async () =>
        await createFacility(mockAppContainer)({
          ...expectedArgs,
          orgId: undefined,
        })
    ).rejects.toThrow();
  });
  it("throws an error if facility code is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    // Act && Assert
    expect(
      async () =>
        await createFacility(mockAppContainer)({
          ...expectedArgs,
          code: undefined,
        })
    ).rejects.toThrow();
  });
});
