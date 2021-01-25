import retrieveFacilityByUuidGateway from "../../../src/gateways/MsSQL/retrieveFacilityByUuid";
import mockAppContainer from "src/containers/AppContainer";

describe("retrieveFacilityByUuidGateway", () => {
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
    const actualFacility = await retrieveFacilityByUuidGateway(
      mockAppContainer
    )(expectedFacilityUuid);
    // Assert
    expect(actualFacility).toEqual(expectedFacility);
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenCalledTimes(1);
    expect(mockAppContainer.getMsSqlConnPool().input).toHaveBeenCalledWith(
      "uuid",
      expect.anything(),
      expectedFacilityUuid
    );
    expect(mockAppContainer.getMsSqlConnPool().query).toHaveBeenCalledWith(
      "SELECT id, name, code, status, uuid FROM dbo.[facility] WHERE uuid=@uuid"
    );
  });
  it("throws an error if msSQL is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool.mockImplementationOnce(() => undefined);
    // Act && Assert
    expect(
      async () =>
        await retrieveFacilityByUuidGateway(mockAppContainer)(
          expectedFacilityUuid
        )
    ).rejects.toThrow();
  });

  it("throws an error if facility uuid is undefined", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    const undefinedUuid = undefined;
    // Act && Assert
    expect(
      async () =>
        await retrieveFacilityByUuidGateway(mockAppContainer)(undefinedUuid)
    ).rejects.toThrowError(TypeError);
  });
  it("throws an error if facility id does not exist in database", async () => {
    // Arrange
    mockAppContainer.getMsSqlConnPool().query.mockImplementationOnce(() =>
      Promise.resolve({
        recordset: undefined,
      })
    );
    const uuidDoesNotExist = 6;
    // Act && Assert
    expect(
      async () =>
        await retrieveFacilityByUuidGateway(mockAppContainer)(uuidDoesNotExist)
    ).rejects.toThrowError(TypeError);
  });
});
