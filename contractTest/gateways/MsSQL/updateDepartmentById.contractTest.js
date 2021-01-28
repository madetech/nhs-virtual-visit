import updateDepartmentByIdGateway from "../../../src/gateways/MsSQL/updateDepartmentById";
import {
  setupOrganization,
  setUpManager,
  setUpFacility,
  setUpDepartment,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("updateDepartmentByIdGateway", () => {
  const container = AppContainer.getInstance();
  const departmentToUpdate = {
    name: "Updated Department",
  };
  it("updates a department", async () => {
    // Arrange
    const {
      organisation: { id: orgId },
    } = await setupOrganization();

    const email = `${Math.random()}@nhs.co.uk`;
    const {
      user: { id: userId },
    } = await setUpManager({ organisationId: orgId, email });

    const facilityUuid = await setUpFacility({ orgId, createdBy: userId });
    const facility = await container.getRetrieveFacilityByUuidGateway()(
      facilityUuid
    );
    const departmentUuid = await setUpDepartment({
      createdBy: userId,
      facilityId: facility.id,
    });
    const currentDepartment = await container.getRetrieveDepartmentByUuidGateway()(
      departmentUuid
    );
    // Act
    await updateDepartmentByIdGateway(container)({
      id: currentDepartment.id,
      name: departmentToUpdate.name,
    });
    const updatedDepartment = await container.getRetrieveDepartmentByUuidGateway()(
      departmentUuid
    );
    // Assert
    expect(updatedDepartment).toEqual({
      ...currentDepartment,
      name: departmentToUpdate.name,
    });
  });
  describe("throws an error", () => {
    it("if id is undefined", async () => {
      // Act && Assert
      expect(
        async () =>
          await updateDepartmentByIdGateway(container)({
            name: departmentToUpdate.name,
          })
      ).rejects.toThrow();
    });
    it("if name is undefined", async () => {
      // Arrange
      const {
        organisation: { id: orgId },
      } = await setupOrganization();

      const email = `${Math.random()}@nhs.co.uk`;
      const {
        user: { id: userId },
      } = await setUpManager({ organisationId: orgId, email });

      const facilityUuid = await setUpFacility({ orgId, createdBy: userId });
      const facility = await container.getRetrieveFacilityByUuidGateway()(
        facilityUuid
      );
      const departmentUuid = await setUpDepartment({
        createdBy: userId,
        facilityId: facility.id,
      });
      const currentDepartment = await container.getRetrieveDepartmentByUuidGateway()(
        departmentUuid
      );
      // Act and Assert
      expect(
        async () =>
          await updateDepartmentByIdGateway(container)({
            id: currentDepartment.id,
          })
      ).rejects.toThrow();
    });
  });
});
