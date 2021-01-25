import createFacility from "../../src/usecases/createFacility";
import mockAppContainer from "src/containers/AppContainer";
describe("createFacility", () => {
  const expectedFacilityUuid = "uuid";
  const createFacilitySpy = jest.fn(async () => expectedFacilityUuid);
  const requestObj = {
    name: "Defoe Hospital",
    orgId: 2,
    code: "DFH",
    createdBy: 10,
  };
  beforeEach(() => {
    mockAppContainer.getCreateFacilityGateway.mockImplementation(
      () => createFacilitySpy
    );
  });

  it("returns no error when facility can be created", async () => {
    // Act
    const { uuid, error } = await createFacility(mockAppContainer)(requestObj);
    // Assert
    expect(uuid).toEqual(expectedFacilityUuid);
    expect(error).toBeNull();
    expect(createFacilitySpy).toHaveBeenCalledWith(requestObj);
  });

  it("returns error response when createFacilityGateway throws an error.", async () => {
    // Arrange
    mockAppContainer.getCreateFacilityGateway.mockImplementationOnce(() =>
      jest.fn(async () => {
        throw new Error("error");
      })
    );
    // Act
    const { uuid, error } = await createFacility(mockAppContainer)(requestObj);
    // Assert
    expect(error).toEqual("There was an error creating a facility.");
    expect(uuid).toBeNull();
  });
  it("returns error when name is undefined", async () => {
    // Act
    const { uuid, error } = await createFacility(mockAppContainer)({
      ...requestObj,
      name: undefined,
    });
    // Assert
    expect(error).toEqual("name must be provided.");
    expect(uuid).toBeUndefined();
  });

  it("returns error when code is undefined", async () => {
    // Act
    const { uuid, error } = await createFacility(mockAppContainer)({
      ...requestObj,
      code: undefined,
    });
    // Assert
    expect(error).toEqual("facility code must be provided.");
    expect(uuid).toBeUndefined();
  });

  it("returns error when orgId is undefined", async () => {
    // Act
    const { uuid, error } = await createFacility(mockAppContainer)({
      ...requestObj,
      orgId: undefined,
    });
    // Assert
    expect(error).toEqual("organisation id must be provided.");
    expect(uuid).toBeUndefined();
  });
});
