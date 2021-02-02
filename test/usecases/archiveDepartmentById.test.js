import archiveDepartmentById from "../../src/usecases/archiveDepartmentById";
import mockAppContainer from "src/containers/AppContainer";
import { statusToId, ARCHIVED } from "../../src/helpers/visitStatus";

describe("archiveDepartmentById", () => {
  // Arrange
  const departmentId = 10;
  const expectedDepartmentUuid = "uuid";

  const archiveDepartmentByIdSpy = jest
    .fn()
    .mockResolvedValue(expectedDepartmentUuid);

  const updateVisitStatusByDepartmentSpy = jest.fn();

  beforeEach(() => {
    mockAppContainer.getArchiveDepartmentByIdGateway.mockImplementation(
      () => archiveDepartmentByIdSpy
    );

    mockAppContainer.getUpdateVisitStatusByDepartmentIdGateway.mockImplementation(
      () => updateVisitStatusByDepartmentSpy
    );
  });
  it("archive a department in the db when valid", async () => {
    // Act
    const { uuid, error } = await archiveDepartmentById(mockAppContainer)(
      departmentId
    );
    // Assert
    expect(archiveDepartmentByIdSpy).toBeCalledWith(departmentId);
    expect(uuid).toEqual(expectedDepartmentUuid);
    expect(error).toBeNull();
  });
  it("returns an error if id is undefined", async () => {
    // Act
    const { uuid, error } = await archiveDepartmentById(mockAppContainer)();
    // Assert
    expect(error).toEqual("id must be provided.");
    expect(uuid).toBeNull();
  });
  it("returns an error object on db exception", async () => {
    // Arrange
    mockAppContainer.getArchiveDepartmentByIdGateway.mockImplementationOnce(
      () =>
        jest.fn(async () => {
          throw new Error("Error");
        })
    );
    // Act
    const { uuid, error } = await archiveDepartmentById(mockAppContainer)(
      departmentId
    );
    // Assert
    expect(error).toEqual("There was an error archiving a department.");
    expect(uuid).toBeNull();
  });

  it("should archive visits when it archives a department", async () => {
    // Act
    await archiveDepartmentById(mockAppContainer)(departmentId);
    // Assert
    expect(updateVisitStatusByDepartmentSpy).toBeCalledWith({
      departmentId,
      status: statusToId(ARCHIVED),
    });
  });
});
