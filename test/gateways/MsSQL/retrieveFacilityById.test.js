import retrieveFacilityByIdGateway from "../../../src/gateways/MsSQL/retrieveFacilityById";
import mockAppContainer from "src/containers/AppContainer";

describe("retrieveFacilityByIdGateway", () => {
  const expectedFacilityUuid = "12SD";
  const expectedFacilityId = 1;
  const expectedFacility = {
    id: expectedFacilityId,
    uuid: expectedFacilityUuid,
    name: "Hospital Name 1",
    code: "HN1",
    status: 1,
  };

  it("retrieve manager in the db when valid", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: [expectedFacility],
      })
    );
    // Act
    const actualFacility = await retrieveFacilityByIdGateway(mockAppContainer)(
      expectedFacilityId
    );
    // Assert
    expect(actualFacility).toEqual(expectedFacility);
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenCalledTimes(1);
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenCalledWith(
      "facilityId",
      expect.anything(),
      expectedFacilityId
    );
    expect(mockAppContainer.getMsSqlConnPool().query).toHaveBeenCalledWith(
      "SELECT id, name, code, status, uuid FROM dbo.[facility] WHERE id=@facilityId"
    );
  });
  it("throws an error if msSQL is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool.mockImplementationOnce(() => undefined);
    // Act && Assert
    expect(
      async () =>
        await retrieveFacilityByIdGateway(mockAppContainer)(expectedFacilityId)
    ).rejects.toThrow();
  });

  it("throws an error if facility id is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    const undefinedId = undefined;
    // Act && Assert
    expect(
      async () =>
        await retrieveFacilityByIdGateway(mockAppContainer)(undefinedId)
    ).rejects.toThrowError(TypeError);
  });
  it("throws an error if facility id does not exist in database", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    const idDoesNotExist = 6;
    // Act && Assert
    expect(
      async () =>
        await retrieveFacilityByIdGateway(mockAppContainer)(idDoesNotExist)
    ).rejects.toThrowError(TypeError);
  });
});
