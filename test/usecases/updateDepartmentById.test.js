import updateDepartmentById from "../../src/usecases/updateDepartmentById";
import mockAppContainer from "src/containers/AppContainer";

describe("updateDepartmentById", () => {
  // Arrange

  const expectedDepartmentUuid = "uuid";
  const expectedDepartment = {
    id: 10,
    name: "Defoe Ward",
  };
  const updateDepartmentByIdSpy = jest
    .fn()
    .mockReturnValue(expectedDepartmentUuid);
  beforeEach(() => {
    mockAppContainer.getUpdateDepartmentByIdGateway.mockImplementation(
      () => updateDepartmentByIdSpy
    );
  });
  it("updates a department in the db when valid", async () => {
    // Act
    const { uuid, error } = await updateDepartmentById(mockAppContainer)(
      expectedDepartment
    );
    // Assert
    expect(updateDepartmentByIdSpy).toBeCalledWith(expectedDepartment);
    expect(uuid).toEqual(expectedDepartmentUuid);
    expect(error).toBeNull();
  });
  it("returns an error if id is undefined", async () => {
    // Act
    const { uuid, error } = await updateDepartmentById(mockAppContainer)({
      ...expectedDepartment,
      id: undefined,
    });
    // Assert
    expect(error).toEqual("id must be provided.");
    expect(uuid).toBeNull();
  });
  it("returns an error if name is undefined", async () => {
    // Act
    const { uuid, error } = await updateDepartmentById(mockAppContainer)({
      ...expectedDepartment,
      name: undefined,
    });
    // Assert
    expect(error).toEqual("department name must be provided.");
    expect(uuid).toBeNull();
  });
  it("returns an error object on db exception", async () => {
    // Arrange
    mockAppContainer.getUpdateDepartmentByIdGateway.mockImplementationOnce(() =>
      jest.fn(async () => {
        throw new Error("Error");
      })
    );
    // Act
    const { uuid, error } = await updateDepartmentById(mockAppContainer)(
      expectedDepartment
    );
    // Assert
    expect(error).toEqual("There was an error updating the department.");
    expect(uuid).toBeNull();
  });
});
