import updateDepartmentStatusByIdGateway from "../../../src/gateways/MsSQL/updateDepartmentStatusById";
import { setupOrganisationFacilityDepartmentAndManager } from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("updateDepartmentStatusByIdGateway", () => {
  const container = AppContainer.getInstance();
  it("updates a department status to 1", async () => {
    // Arrange
    const email = `${Math.random()}@nhs.co.uk`;
    const {
      departmentUuid,
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager({
      userArgs: { email },
    });
    const currentDepartment = await container.getRetrieveDepartmentByUuidGateway()(
      departmentUuid
    );
    // Act
    await updateDepartmentStatusByIdGateway(container)({
      id: departmentId,
      status: 1,
    });
    const archivedDepartment = await container.getRetrieveDepartmentByUuidGateway()(
      departmentUuid
    );
    // Assert
    expect(archivedDepartment).toEqual({ ...currentDepartment, status: 1 });
  });
  it("updates a department status to 0", async () => {
    // Arrange
    const email = `${Math.random()}@nhs.co.uk`;
    const {
      departmentUuid,
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager({
      userArgs: { email },
    });
    const currentDepartment = await container.getRetrieveDepartmentByUuidGateway()(
      departmentUuid
    );
    // Act
    await updateDepartmentStatusByIdGateway(container)({
      id: departmentId,
      status: 0,
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
