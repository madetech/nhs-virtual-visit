import updateFacilityByIdGateway from "../../../src/gateways/MsSQL/updateFacilityById";
import mockAppContainer from "src/containers/AppContainer";

describe("updateFacilityByIdGateway", () => {
  const expectedFacilityUuid = "uuid";
  const facilityObj = {
    id: 1,
    name: "Hospital Name One",
    status: 0,
  };
  it("updates facility in the db when valid", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: [{ uuid: expectedFacilityUuid }],
      })
    );
    // Act
    const uuid = await updateFacilityByIdGateway(mockAppContainer)(facilityObj);
    // Assert
    expect(uuid).toEqual(expectedFacilityUuid);
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      1,
      "id",
      expect.anything(),
      1
    );
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenCalledTimes(2);
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenNthCalledWith(
      2,
      "name",
      expect.anything(),
      "Hospital Name One"
    );

    expect(mockAppContainer.getMsSqlConnPool().query).toHaveBeenCalledWith(
      "UPDATE dbo.[facility] SET name = @name OUTPUT inserted.uuid WHERE id = @id"
    );
  });
  it("throws an error if db is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool.mockImplementationOnce(() => undefined);

    // Act && Assert
    expect(
      async () => await updateFacilityByIdGateway(mockAppContainer)(facilityObj)
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
      async () => await updateFacilityByIdGateway(mockAppContainer)(undefined)
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
      async () => await updateFacilityByIdGateway(mockAppContainer)(facilityObj)
    ).rejects.toThrowError(TypeError);
  });
});
