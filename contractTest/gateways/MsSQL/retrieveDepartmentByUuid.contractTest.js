import retrieveDepartmentByUuidGateway from "../../../src/gateways/MsSQL/retrieveDepartmentByUuid";
import {
  setupOrganization,
  setUpManager,
  setUpFacility,
  setUpDepartment,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveDepartmentByUuid", () => {
  const container = AppContainer.getInstance();
  const departmentCreated = {
    name: "Test Department",
    code: "departmentCode",
  };
  it("returns an object containing the department", async () => {
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
    // Act

    const department = await retrieveDepartmentByUuidGateway(container)(
      departmentUuid
    );
    // Assert
    expect(department).toEqual({
      ...departmentCreated,
      id: department.id,
      uuid: departmentUuid,
      status: 1,
      facilityId: facility.id,
    });
  });

  it("returns department as undefined if uuid is undefined", async () => {
    // Arrange
    const department = await retrieveDepartmentByUuidGateway(container)();
    expect(department).toBeUndefined();
  });
});
