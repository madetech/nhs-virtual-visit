import retrieveDepartmentByUuidGateway from "../../../src/gateways/MsSQL/retrieveDepartmentByUuid";
import { setupOrganisationFacilityDepartmentAndManager } from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveDepartmentByUuid", () => {
  const container = AppContainer.getInstance();
  const departmentArgs = {
    name: "Test Department",
    code: "departmentCode",
  };
  it("returns an object containing the department", async () => {
    // Arrange
    const email = `${Math.random()}@nhs.co.uk`;
    const {
      departmentUuid,
      departmentId,
      facilityId,
    } = await setupOrganisationFacilityDepartmentAndManager({
      userArgs: { email },
      departmentArgs,
    });
    // Act
    const department = await retrieveDepartmentByUuidGateway(container)(
      departmentUuid
    );
    // Assert
    expect(department).toEqual({
      ...departmentArgs,
      id: departmentId,
      uuid: departmentUuid,
      status: 1,
      facilityId,
    });
  });

  it("returns department as undefined if uuid is undefined", async () => {
    // Arrange
    const department = await retrieveDepartmentByUuidGateway(container)();
    expect(department).toBeUndefined();
  });
});
