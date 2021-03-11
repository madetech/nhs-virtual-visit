import retrieveTotalVisitsByStatusAndOrgIdGateway from "../../../src/gateways/MsSQL/retrieveTotalVisitsByStatusAndOrgId.js.js";
import {
  setupAdminAndOrganisation,
  setUpFacility,
  setupOrganization,
  setUpDepartment,
  setUpScheduledCall,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";
import { COMPLETE, statusToId } from "../../../src/helpers/visitStatus";

describe("retrieveTotalVisitsByStatusAndOrgIdGateway", () => {
  const container = AppContainer.getInstance();
  it("retrieves scheduled call total when given a valid org Id with no status passed", async () => {
    // Arrange
    const { adminId, orgId: orgOneId } = await setupAdminAndOrganisation();
    const { organisation: { id: orgTwoId } } = await setupOrganization({ createdBy: adminId });
    const { facilityId: facilityOneId } = await setUpFacility({ createdBy: adminId, orgId: orgOneId });
    const { facilityId: facilityTwoId } = await setUpFacility({ createdBy: adminId, orgId: orgOneId });
    const { facilityId: facilityThreeId } = await setUpFacility({ createdBy: adminId, orgId: orgTwoId });
    const { departmentId: departmentOneId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityOneId });
    const { departmentId: departmentTwoId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityOneId });
    const { departmentId: departmentThreeId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityTwoId });
    const { departmentId: departmentFourId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityThreeId });
  
    await setUpScheduledCall({ departmentId: departmentOneId });
    await setUpScheduledCall({ departmentId: departmentOneId });
    await setUpScheduledCall({ departmentId: departmentTwoId });
    await setUpScheduledCall({ departmentId: departmentThreeId });
    await setUpScheduledCall({ departmentId: departmentFourId });
    // Act
    const total = await retrieveTotalVisitsByStatusAndOrgIdGateway(container)({
      orgId: orgOneId
    });
    // Assert
    expect(total).toEqual(4);
  });
  it ("returns 0 when no visits exist", async ()=>{
      // Arrange
      const { adminId, orgId } = await setupAdminAndOrganisation();
      const { facilityId } = await setUpFacility({ createdBy: adminId, orgId });
      await setUpDepartment({ createdBy: adminId, facilityId: facilityId });
     // Act
     const total = await retrieveTotalVisitsByStatusAndOrgIdGateway(container)({
      orgId
     });
    // Assert
    expect(total).toEqual(0);
  })
  it("retrieves scheduled call total when given a valid org Id with status passed", async () => {
    // Arrange
    const { adminId, orgId: orgOneId } = await setupAdminAndOrganisation();
    const { organisation: { id: orgTwoId } } = await setupOrganization({ createdBy: adminId });
    const { facilityId: facilityOneId } = await setUpFacility({ createdBy: adminId, orgId: orgOneId });
    const { facilityId: facilityTwoId } = await setUpFacility({ createdBy: adminId, orgId: orgOneId });
    const { facilityId: facilityThreeId } = await setUpFacility({ createdBy: adminId, orgId: orgTwoId });
    const { departmentId: departmentOneId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityOneId });
    const { departmentId: departmentTwoId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityOneId });
    const { departmentId: departmentThreeId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityTwoId });
    const { departmentId: departmentFourId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityThreeId });
  
    const { uuid } = await setUpScheduledCall({ departmentId: departmentOneId });
    await setUpScheduledCall({ departmentId: departmentOneId });
    await setUpScheduledCall({ departmentId: departmentTwoId });
    await setUpScheduledCall({ departmentId: departmentThreeId });
    await setUpScheduledCall({ departmentId: departmentFourId });
    
    await container.getUpdateVisitStatusByCallIdGateway()({
      id: uuid,
      wardId: departmentOneId,
      status: statusToId(COMPLETE),
    });
    // Act
    const total = await retrieveTotalVisitsByStatusAndOrgIdGateway(container)({
      orgId: orgOneId,
      status: COMPLETE
    });
    // Assert
    expect(total).toEqual(1);
  });
  it("returns undefined when given invalid facility id", async () => {
    // Arrange
    const idDoesNotExist = 111111111;
    
    // Act
    const total = await retrieveTotalVisitsByStatusAndOrgIdGateway(container)({
        orgId: idDoesNotExist
    });
    // Assert
    expect(total).toBeDefined();
  });

  it("throws an error when facility id is not an integer", async () => {
    // Arrange
    const invalidId = "invalid";
    // Act && Assert
    expect( async() => await retrieveTotalVisitsByStatusAndOrgIdGateway(container)({ orgId: invalidId }) ).rejects.toThrowError();
  });
});
