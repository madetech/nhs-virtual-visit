import retrieveDepartmentByUuid from "../../src/usecases/retrieveDepartmentByUuid";
import mockAppContainer from "src/containers/AppContainer";

describe("retrieveDepartmentByUuid", () => {
  // Arrange
  const expectedDepartmentUuid = "department-uuid";
  const expectedDepartment = {
    id: 1,
    uuid: expectedDepartmentUuid,
    name: "wardNameOne",
    code: "WNO",
    status: "active",
    facilityId: 1,
  };

  it("returns no error if department can be retrieved", async () => {
    //Arrange
    const getRetrieveDepartmentByUuidSpy = jest.fn(() =>
      Promise.resolve({
        ...expectedDepartment,
        status: expectedDepartment.status == "active" ? 1 : 0,
      })
    );
    mockAppContainer.getRetrieveDepartmentByUuidGateway.mockImplementationOnce(
      () => getRetrieveDepartmentByUuidSpy
    );
    // Act
    const { department, error } = await retrieveDepartmentByUuid(
      mockAppContainer
    )(expectedDepartmentUuid);
    // Assert
    expect(error).toBeNull();
    expect(department).toEqual(expectedDepartment);
    expect(getRetrieveDepartmentByUuidSpy).toBeCalledWith(
      expectedDepartmentUuid
    );
  });
  it("returns status of active if department status retrieved is 1", async () => {
    // Arrange
    const getRetrieveDepartmentByUuidSpy = jest.fn(() =>
      Promise.resolve({ ...expectedDepartment, status: 1 })
    );
    mockAppContainer.getRetrieveDepartmentByUuidGateway.mockImplementationOnce(
      () => getRetrieveDepartmentByUuidSpy
    );
    // Act
    const { department, error } = await retrieveDepartmentByUuid(
      mockAppContainer
    )(expectedDepartmentUuid);
    // Assert
    expect(error).toBeNull();
    expect(department).toEqual(expectedDepartment);
    expect(getRetrieveDepartmentByUuidSpy).toBeCalledWith(
      expectedDepartmentUuid
    );
  });
  it("returns status of disabled if manager status retrieved is 0", async () => {
    // Arrange
    const getRetrieveDepartmentByUuidSpy = jest.fn(async () =>
      Promise.resolve({ ...expectedDepartment, status: 0 })
    );
    mockAppContainer.getRetrieveDepartmentByUuidGateway.mockImplementationOnce(
      () => getRetrieveDepartmentByUuidSpy
    );
    // Act
    const { department, error } = await retrieveDepartmentByUuid(
      mockAppContainer
    )(expectedDepartmentUuid);
    // Assert
    expect(error).toBeNull();
    expect(department).toEqual({ ...expectedDepartment, status: "disabled" });
    expect(getRetrieveDepartmentByUuidSpy).toBeCalledWith(
      expectedDepartmentUuid
    );
  });
  it("returns an error if manager cannot be retrieved", async () => {
    const retrieveDepartmentByUuidErrorSpy = jest.fn(async () => {
      throw new Error("error");
    });
    mockAppContainer.getRetrieveDepartmentByUuidGateway.mockImplementationOnce(
      () => retrieveDepartmentByUuidErrorSpy
    );

    const { department, error } = await retrieveDepartmentByUuid(
      mockAppContainer
    )(expectedDepartmentUuid);
    expect(error).toEqual("There was an error retrieving a department.");
    expect(department).toBeNull();
    expect(retrieveDepartmentByUuidErrorSpy).toBeCalledWith(
      expectedDepartmentUuid
    );
  });
  it("returns an error if uuid does not exist", async () => {
    const { department, error } = await retrieveDepartmentByUuid(
      mockAppContainer
    )();
    expect(error).toEqual("uuid must be provided.");
    expect(department).toBeNull();
  });
});
