import archiveDepartmentByIdGateway from "../../../src/gateways/MsSQL/archiveDepartmentById";
import {
  setupOrganization,
  setUpManager,
  setUpFacility,
  setUpDepartment,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("archiveDepartmentByIdGateway", () => {
  const container = AppContainer.getInstance();
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
    await archiveDepartmentByIdGateway(container)(currentDepartment.id);
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
    //   it("if name is undefined", async () => {
    //     // Arrange
    //     expect( async () => await archiveDepartmentByIdGateway(container)({id: department.id })).rejects.toThrow();
    //   });
  });
});
