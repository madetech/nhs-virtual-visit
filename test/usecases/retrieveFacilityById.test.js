import retrieveFacilityById from "../../src/usecases/retrieveFacilityById";
import mockAppContainer from "src/containers/AppContainer";

describe("retrieveFacilityById", () => {
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
    const getRetrieveFacilityByIdSpy = jest.fn(() =>
      Promise.resolve({
        ...expectedFacility,
        status: expectedFacility.status == "active" ? 1 : 0,
      })
    );
    mockAppContainer.getRetrieveFacilityByIdGateway.mockImplementationOnce(
      () => getRetrieveFacilityByIdSpy
    );
    // Act
    const { facility, error } = await retrieveFacilityById(mockAppContainer)(
      expectedFacilityId
    );
    // Assert
    expect(error).toBeNull();
    expect(facility).toEqual(expectedFacility);
    expect(getRetrieveFacilityByIdSpy).toBeCalledWith(expectedFacilityId);
  });
  it("returns status of active if department status retrieved is 1", async () => {
    // Arrange
    const getRetrieveFacilityByIdSpy = jest.fn(() =>
      Promise.resolve({ ...expectedFacility, status: 1 })
    );
    mockAppContainer.getRetrieveFacilityByIdGateway.mockImplementationOnce(
      () => getRetrieveFacilityByIdSpy
    );
    // Act
    const { facility, error } = await retrieveFacilityById(mockAppContainer)(
      expectedFacilityId
    );
    // Assert
    expect(error).toBeNull();
    expect(facility).toEqual(expectedFacility);
    expect(getRetrieveFacilityByIdSpy).toBeCalledWith(expectedFacilityId);
  });
  it("returns status of disabled if facility status retrieved is 0", async () => {
    // Arrange
    const getRetrieveFacilityByIdSpy = jest.fn(async () =>
      Promise.resolve({ ...expectedFacility, status: 0 })
    );
    mockAppContainer.getRetrieveFacilityByIdGateway.mockImplementationOnce(
      () => getRetrieveFacilityByIdSpy
    );
    // Act
    const { facility, error } = await retrieveFacilityById(mockAppContainer)(
      expectedFacilityId
    );
    // Assert
    expect(error).toBeNull();
    expect(facility).toEqual({ ...expectedFacility, status: "disabled" });
    expect(getRetrieveFacilityByIdSpy).toBeCalledWith(expectedFacilityId);
  });
  it("returns an error if facility cannot be retrieved", async () => {
    const retrieveFacilityByIdErrorSpy = jest.fn(async () => {
      throw new Error("error");
    });
    mockAppContainer.getRetrieveFacilityByIdGateway.mockImplementationOnce(
      () => retrieveFacilityByIdErrorSpy
    );

    const { facility, error } = await retrieveFacilityById(mockAppContainer)(
      expectedFacilityId
    );
    expect(error).toEqual("There has been an error retrieving the facility.");
    expect(facility).toBeNull();
    expect(retrieveFacilityByIdErrorSpy).toBeCalledWith(expectedFacilityId);
  });
  it("returns an error if id does not exist", async () => {
    const { facility, error } = await retrieveFacilityById(mockAppContainer)();
    expect(error).toEqual("facility id must be present.");
    expect(facility).toBeNull();
  });
});
