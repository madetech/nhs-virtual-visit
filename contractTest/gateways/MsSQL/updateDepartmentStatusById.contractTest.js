import updateDepartmentStatusByIdGateway from "../../../src/gateways/MsSQL/updateDepartmentStatusById";
import { setupOrganisationFacilityDepartmentAndManager } from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";
import { statusToId, ACTIVE, DISABLED } from "../../../src/helpers/statusTypes";

describe("updateDepartmentStatusByIdGateway", () => {
  const container = AppContainer.getInstance();
  it("updates a department status to ACTIVE", async () => {
    // Arrange
    const {
      departmentUuid,
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    const currentDepartment = await container.getRetrieveDepartmentByUuidGateway()(
      departmentUuid
    );
    // Act
    await updateDepartmentStatusByIdGateway(container)({
      id: departmentId,
      status: statusToId(ACTIVE),
    });
    const archivedDepartment = await container.getRetrieveDepartmentByUuidGateway()(
      departmentUuid
    );
    // Assert
    expect(archivedDepartment).toEqual({
      ...currentDepartment,
      status: statusToId(ACTIVE),
    });
  });
  it("updates a department status to DISABLED", async () => {
    // Arrange
    const {
      departmentUuid,
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();
    const currentDepartment = await container.getRetrieveDepartmentByUuidGateway()(
      departmentUuid
    );
    // Act
    await updateDepartmentStatusByIdGateway(container)({
      id: departmentId,
      status: statusToId(DISABLED),
    });
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
        async () => await updateDepartmentStatusByIdGateway(container)()
      ).rejects.toThrow();
    });
  });
});
