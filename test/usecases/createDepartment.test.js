import createDepartment from "../../src/usecases/createDepartment";
import mockAppContainer from "src/containers/AppContainer";

describe("createDepartment", () => {
  const expectedDepartmentUuid = "uuid";
  const createDepartmentSpy = jest.fn(async () => expectedDepartmentUuid);
  const requestObj = {
    name: "Defoe Ward",
    code: "WardCode",
    facilityId: "1",
    pin: "1234",
    createdBy: 10,
  };
  beforeEach(() => {
    mockAppContainer.getCreateDepartmentGateway.mockImplementation(
      () => createDepartmentSpy
    );
  });

  it("returns no error when facility can be created", async () => {
    // Act
    const { uuid, error } = await createDepartment(mockAppContainer)(
      requestObj
    );
    // Assert
    expect(uuid).toEqual(expectedDepartmentUuid);
    expect(error).toBeNull();
    expect(createDepartmentSpy).toHaveBeenCalledWith(requestObj);
  });

  it("returns error response when createDepartmentGateway throws an error.", async () => {
    // Arrange
    mockAppContainer.getCreateDepartmentGateway.mockImplementationOnce(() =>
      jest.fn(async () => {
        throw new Error("error");
      })
    );
    // Act
    const { uuid, error } = await createDepartment(mockAppContainer)(
      requestObj
    );
    // Assert
    expect(error).toEqual("There was an error creating a department.");
    expect(uuid).toBeNull();
  });
  it("returns error when name is undefined", async () => {
    // Act
    const { uuid, error } = await createDepartment(mockAppContainer)({
      ...requestObj,
      name: undefined,
    });
    // Assert
    expect(error).toEqual("name must be provided.");
    expect(uuid).toBeNull();
  });

  it("returns error when createdBy is undefined", async () => {
    // Act
    const { uuid, error } = await createDepartment(mockAppContainer)({
      ...requestObj,
      createdBy: undefined,
    });
    // Assert
    expect(error).toEqual("user id must be provided.");
    expect(uuid).toBeNull();
  });
  it("returns error when pin is undefined", async () => {
    // Act
    const { uuid, error } = await createDepartment(mockAppContainer)({
      ...requestObj,
      pin: undefined,
    });
    // Assert
    expect(error).toEqual("pin must be provided.");
    expect(uuid).toBeNull();
  });
  it("returns error when code is undefined", async () => {
    // Act
    const { uuid, error } = await createDepartment(mockAppContainer)({
      ...requestObj,
      code: undefined,
    });
    // Assert
    expect(error).toEqual("code must be provided.");
    expect(uuid).toBeNull();
  });

  it("returns error when faciltyId is undefined", async () => {
    // Act
    const { uuid, error } = await createDepartment(mockAppContainer)({
      ...requestObj,
      facilityId: undefined,
    });
    // Assert
    expect(error).toEqual("facility id must be provided.");
    expect(uuid).toBeNull();
  });
});
