import archiveDepartmentByIdGateway from "../../../src/gateways/MsSQL/archiveDepartmentById";
import { setupOrganisationFacilityDepartmentAndManager } from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("archiveDepartmentByIdGateway", () => {
  const container = AppContainer.getInstance();
  it("updates a department", async () => {
    // Arrange
    const {
      departmentUuid,
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    const currentDepartment = await container.getRetrieveDepartmentByUuidGateway()(
      departmentUuid
    );
    // Act
    await archiveDepartmentByIdGateway(container)(departmentId);
    const archivedDepartment = await container.getRetrieveDepartmentByUuidGateway()(
      departmentUuid
    );
    // Assert
    expect(archivedDepartment).toEqual({ ...currentDepartment, status: 0 });
  });
  describe("throws an error", () => {
    it("if id is undefined", async () => {
      // Arrange
      expect(
        async () => await archiveDepartmentByIdGateway(container)()
      ).rejects.toThrow();
    });
  });
});
