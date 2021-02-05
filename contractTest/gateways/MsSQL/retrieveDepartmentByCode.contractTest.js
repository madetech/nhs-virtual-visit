import retrieveDepartmentByCodeGateway from "../../../src/gateways/MsSQL/retrieveDepartmentByCode";
import { setupOrganisationFacilityDepartmentAndManager } from "../../../test/testUtils/factories";
import { statusToId, ACTIVE } from "../../../src/helpers/statusTypes";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveActiveDepartmentsByFacilityIdGateway", () => {
  const container = AppContainer.getInstance();
  it("retrieves department returning object containing trustId, wardId and wardCode", async () => {
    // Arrange
    const departmentCreated = {
      code: "WardCodeOne",
    };
    const {
      orgId,
      departmentId,
      departmentUuid,
    } = await setupOrganisationFacilityDepartmentAndManager({
      departmentArgs: { code: departmentCreated.code },
    });
    // Act
    const department = await retrieveDepartmentByCodeGateway(container)(
      departmentCreated.code
    );
    // Assert
    expect(department).toEqual({
      wardId: departmentId,
      uuid: departmentUuid,
      trustId: orgId,
      wardCode: departmentCreated.code,
      wardStatus: statusToId(ACTIVE),
    });
  });
  it("returns department as undefined if wardcode doesn't exist", async () => {
    // Act
    const department = await retrieveDepartmentByCodeGateway(container)(
      "ABCDEFGHI"
    );
    // Assert
    expect(department).toBeUndefined();
  });
});