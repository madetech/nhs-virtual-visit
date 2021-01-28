import updateFacilityById from "../../src/usecases/updateFacilityById";
import mockAppContainer from "src/containers/AppContainer";

describe("updateFacilityById", () => {
  // Arrange

  const expectedFacilityUuid = "uuid";
  const expectedFacility = {
    id: 10,
    name: "Hospital Name One",
  };
  const updateFacilityByIdSpy = jest.fn().mockReturnValue(expectedFacilityUuid);
  beforeEach(() => {
    mockAppContainer.getUpdateFacilityByIdGateway.mockImplementation(
      () => updateFacilityByIdSpy
    );
  });
  it("updates a department in the db when valid", async () => {
    // Act
    const { uuid, error } = await updateFacilityById(mockAppContainer)(
      expectedFacility
    );
    // Assert
    expect(updateFacilityByIdSpy).toBeCalledWith(expectedFacility);
    expect(uuid).toEqual(expectedFacilityUuid);
    expect(error).toBeNull();
  });
  it("returns an error if id is undefined", async () => {
    // Act
    const { uuid, error } = await updateFacilityById(mockAppContainer)({
      ...expectedFacility,
      id: undefined,
    });
    // Assert
    expect(error).toEqual("id must be provided.");
    expect(uuid).toBeNull();
  });
  it("returns an error if name is undefined", async () => {
    // Act
    const { uuid, error } = await updateFacilityById(mockAppContainer)({
      ...expectedFacility,
      name: undefined,
    });
    // Assert
    expect(error).toEqual("facility name must be provided.");
    expect(uuid).toBeNull();
  });
  it("returns an error object on db exception", async () => {
    // Arrange
    mockAppContainer.getUpdateFacilityByIdGateway.mockImplementationOnce(() =>
      jest.fn(async () => {
        throw new Error("Error");
      })
    );
    // Act
    const { uuid, error } = await updateFacilityById(mockAppContainer)(
      expectedFacility
    );
    // Assert
    expect(error).toEqual("There was an error updating the facility.");
    expect(uuid).toBeNull();
  });
});
