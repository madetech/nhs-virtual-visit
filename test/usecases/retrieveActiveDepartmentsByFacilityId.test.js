import retrieveDepartmentsByFacilityId from "../../src/usecases/retrieveActiveDepartmentsByFacilityId";
import mockAppContainer from "src/containers/AppContainer";
describe("retrieveDepartmentsByFacilityId", () => {
  // Arrange
  const expectedFacilityId = 1;
  const expectedDepartments = [
    {
      id: 1,
      uuid: "uuid 1",
      name: "Ward One",
      code: "WD1",
      status: 1,
      facilityId: expectedFacilityId,
    },
    {
      id: 5,
      uuid: "uuid 5",
      name: "Ward Five",
      code: "WD5",
      status: 0,
      facilityId: expectedFacilityId,
    },
  ];
  const retrieveDepartmentsByFacilityIdSpy = jest.fn(
    async () => expectedDepartments
  );
  beforeEach(() => {
    mockAppContainer.getRetrieveActiveDepartmentsByFacilityIdGateway.mockImplementation(
      () => retrieveDepartmentsByFacilityIdSpy
    );
  });
  it("returns no error if departments can be retrieved", async () => {
    // Act
    const { departments, error } = await retrieveDepartmentsByFacilityId(
      mockAppContainer
    )(expectedFacilityId);
    // Assert
    expect(error).toBeNull();
    departments.map((department, idx) =>
      expect(department).toEqual({
        ...expectedDepartments[idx],
        status: expectedDepartments[idx].status === 0 ? "disabled" : "active",
      })
    );
    expect(retrieveDepartmentsByFacilityIdSpy).toBeCalledWith(
      expectedFacilityId
    );
  });
  it("returns an error object on db exception", async () => {
    const retrieveDepartmentsByFacilityIdErrorSpy = jest.fn(async () => {
      throw new Error("error");
    });
    mockAppContainer.getRetrieveActiveDepartmentsByFacilityIdGateway.mockImplementationOnce(
      () => retrieveDepartmentsByFacilityIdErrorSpy
    );
    const { departments, error } = await retrieveDepartmentsByFacilityId(
      mockAppContainer
    )(expectedFacilityId);
    expect(error).toEqual("There was an error retrieving departments.");
    expect(departments).toBeNull();
    expect(retrieveDepartmentsByFacilityIdErrorSpy).toBeCalledWith(
      expectedFacilityId
    );
  });
  it("returns an error if returned departments is undefined", async () => {
    const retrieveDepartmentsByFacilityIdUndefinedSpy = jest.fn(async () =>
      Promise.resolved({ recordset: undefined })
    );
    mockAppContainer.getRetrieveActiveDepartmentsByFacilityIdGateway.mockImplementationOnce(
      () => retrieveDepartmentsByFacilityIdUndefinedSpy
    );
    const { departments, error } = await retrieveDepartmentsByFacilityId(
      mockAppContainer
    )(expectedFacilityId);
    expect(error).toEqual("There was an error retrieving departments.");
    expect(departments).toBeNull();
    expect(retrieveDepartmentsByFacilityIdUndefinedSpy).toBeCalledWith(
      expectedFacilityId
    );
  });
  it("returns an error if id is not provided", async () => {
    const { departments, error } = await retrieveDepartmentsByFacilityId(
      mockAppContainer
    )();
    expect(error).toEqual("id must be provided.");
    expect(departments).toBeNull();
  });
});
