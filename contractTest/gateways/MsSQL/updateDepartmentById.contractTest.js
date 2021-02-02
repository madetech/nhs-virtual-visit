import updateDepartmentByIdGateway from "../../../src/gateways/MsSQL/updateDepartmentById";
import { setupOrganisationFacilityDepartmentAndManager } from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("updateDepartmentByIdGateway", () => {
  const container = AppContainer.getInstance();
  const departmentArgs = {
    name: "Updated Department",
  };
  let ids;
  beforeEach(async () => {
    ids = await setupOrganisationFacilityDepartmentAndManager({
      departmentArgs,
    });
  });
  it("updates a department", async () => {
    // Arrange
    const { departmentId, departmentUuid } = ids;
    const currentDepartment = await container.getRetrieveDepartmentByUuidGateway()(
      departmentUuid
    );
    // Act
    await updateDepartmentByIdGateway(container)({
      id: departmentId,
      name: departmentArgs.name,
    });
    const updatedDepartment = await container.getRetrieveDepartmentByUuidGateway()(
      departmentUuid
    );
    // Assert
    expect(updatedDepartment).toEqual({
      ...currentDepartment,
      name: departmentArgs.name,
    });
  });
  describe("throws an error", () => {
    it("if id is undefined", async () => {
      // Act && Assert
      expect(
        async () =>
          await updateDepartmentByIdGateway(container)({
            name: departmentArgs.name,
          })
      ).rejects.toThrow();
    });
    it("if name is undefined", async () => {
      // Arrange
      const { departmentId } = ids;
      // Act and Assert
      expect(
        async () =>
          await updateDepartmentByIdGateway(container)({
            id: departmentId,
          })
      ).rejects.toThrow();
    });
  });
});
