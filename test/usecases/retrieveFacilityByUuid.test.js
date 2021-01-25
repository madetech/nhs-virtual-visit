import retrieveFacilityByUuid from "../../src/usecases/retrieveFacilityByUuid";
import mockAppContainer from "src/containers/AppContainer";

describe("retrieveFacilityByUuid", () => {
  // Arrange
  const expectedFacilityUuid = "facility-uuid";
  const expectedFacilityId = 1;
  const expectedFacility = {
    id: expectedFacilityId,
    uuid: expectedFacilityUuid,
    name: "Hospital Name 1",
    code: "HN1",
    status: "active",
  };

  it("returns no error if facility can be retrieved", async () => {
    //Arrange
    const getRetrieveFacilityByUuidSpy = jest.fn(() =>
      Promise.resolve({
        ...expectedFacility,
        status: expectedFacility.status == "active" ? 1 : 0,
      })
    );
    mockAppContainer.getRetrieveFacilityByUuidGateway.mockImplementationOnce(
      () => getRetrieveFacilityByUuidSpy
    );
    // Act
    const { facility, error } = await retrieveFacilityByUuid(mockAppContainer)(
      expectedFacilityUuid
    );
    // Assert
    expect(error).toBeNull();
    expect(facility).toEqual(expectedFacility);
    expect(getRetrieveFacilityByUuidSpy).toBeCalledWith(expectedFacilityUuid);
  });
  it("returns status of active if department status retrieved is 1", async () => {
    // Arrange
    const getRetrieveFacilityByUuidSpy = jest.fn(() =>
      Promise.resolve({ ...expectedFacility, status: 1 })
    );
    mockAppContainer.getRetrieveFacilityByUuidGateway.mockImplementationOnce(
      () => getRetrieveFacilityByUuidSpy
    );
    // Act
    const { facility, error } = await retrieveFacilityByUuid(mockAppContainer)(
      expectedFacilityUuid
    );
    // Assert
    expect(error).toBeNull();
    expect(facility).toEqual(expectedFacility);
    expect(getRetrieveFacilityByUuidSpy).toBeCalledWith(expectedFacilityUuid);
  });
  it("returns status of disabled if facility status retrieved is 0", async () => {
    // Arrange
    const getRetrieveFacilityByUuidSpy = jest.fn(async () =>
      Promise.resolve({ ...expectedFacility, status: 0 })
    );
    mockAppContainer.getRetrieveFacilityByUuidGateway.mockImplementationOnce(
      () => getRetrieveFacilityByUuidSpy
    );
    // Act
    const { facility, error } = await retrieveFacilityByUuid(mockAppContainer)(
      expectedFacilityUuid
    );
    // Assert
    expect(error).toBeNull();
    expect(facility).toEqual({ ...expectedFacility, status: "disabled" });
    expect(getRetrieveFacilityByUuidSpy).toBeCalledWith(expectedFacilityUuid);
  });
  it("returns an error if facility cannot be retrieved", async () => {
    const retrieveFacilityByUuidErrorSpy = jest.fn(async () => {
      throw new Error("error");
    });
    mockAppContainer.getRetrieveFacilityByUuidGateway.mockImplementationOnce(
      () => retrieveFacilityByUuidErrorSpy
    );

    const { facility, error } = await retrieveFacilityByUuid(mockAppContainer)(
      expectedFacilityUuid
    );
    expect(error).toEqual("There has been an error retrieving facility.");
    expect(facility).toBeNull();
    expect(retrieveFacilityByUuidErrorSpy).toBeCalledWith(expectedFacilityUuid);
  });
  it("returns an error if id does not exist", async () => {
    const { facility, error } = await retrieveFacilityByUuid(
      mockAppContainer
    )();
    expect(error).toEqual("uuid must be present.");
    expect(facility).toBeNull();
  });
});
