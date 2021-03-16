import retrieveTotalVisitsByStatusAndFacilityIdGateway from "../../../src/gateways/MsSQL/retrieveTotalVisitsByStatusAndFacilityId";
import {
  setupAdminAndOrganisation,
  setUpFacility,
  setUpDepartment,
  setUpScheduledCall,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";
import { COMPLETE, statusToId } from "../../../src/helpers/visitStatus";

describe("retrieveTotalVisitsByStatusAndFacilityIdGateway", () => {
  const container = AppContainer.getInstance();

  it("retrieves scheduled call when given a valid facility id with no status passed", async () => {
    // Arrange
    const { adminId, orgId } = await setupAdminAndOrganisation();
    const { facilityId: facilityOneId } = await setUpFacility({ createdBy: adminId, orgId });
    const { facilityId: facilityTwoId } = await setUpFacility({ createdBy: adminId, orgId });
    const { departmentId: departmentOneId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityOneId });
    const { departmentId: departmentTwoId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityOneId });
    const { departmentId: departmentThreeId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityTwoId });
  
    await setUpScheduledCall({ departmentId: departmentOneId });
    await setUpScheduledCall({ departmentId: departmentOneId });
    await setUpScheduledCall({ departmentId: departmentTwoId });
    await setUpScheduledCall({ departmentId: departmentThreeId });
    // Act
    const total = await retrieveTotalVisitsByStatusAndFacilityIdGateway(container)({
      facilityId: facilityOneId
    });
    // Assert
    expect(total).toEqual(3);
  });
  it ("returns 0 when no visits exist", async ()=>{
      // Arrange
      const { adminId, orgId } = await setupAdminAndOrganisation();
      const { facilityId } = await setUpFacility({ createdBy: adminId, orgId });
      await setUpDepartment({ createdBy: adminId, facilityId: facilityId });
     // Act
     const total = await retrieveTotalVisitsByStatusAndFacilityIdGateway(container)({
      facilityId
     });
    // Assert
    expect(total).toEqual(0);
  })
  it("retrieves scheduled call when given a valid facility id and status passed", async () => {
    // Arrange
    const { adminId, orgId } = await setupAdminAndOrganisation();
    const { facilityId: facilityOneId } = await setUpFacility({ createdBy: adminId, orgId });
    const { facilityId: facilityTwoId } = await setUpFacility({ createdBy: adminId, orgId });
    const { departmentId: departmentOneId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityOneId });
    const { departmentId: departmentTwoId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityOneId });
    const { departmentId: departmentThreeId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityTwoId });
  
    const { uuid } = await setUpScheduledCall({ departmentId: departmentOneId });
    await setUpScheduledCall({ departmentId: departmentOneId });
    await setUpScheduledCall({ departmentId: departmentTwoId });
    await setUpScheduledCall({ departmentId: departmentThreeId });

    await container.getUpdateVisitStatusByCallIdGateway()({
      id: uuid,
      wardId: departmentOneId,
      status: statusToId(COMPLETE),
    });

    // Act
    const total = await retrieveTotalVisitsByStatusAndFacilityIdGateway(container)({
      facilityId: facilityOneId,
      status: COMPLETE
    });
    // Assert
    expect(total).toEqual(1);
  });
  it("returns undefined when given invalid facility id", async () => {
    // Arrange
    const idDoesNotExist = 111111111;
    
    // Act
    const total = await retrieveTotalVisitsByStatusAndFacilityIdGateway(container)(
        idDoesNotExist
      );
    // Assert
    expect(total).toBeDefined();
  });

  it("throws an error when facility id is not an integer", async () => {
    // Arrange
    const invalidId = "invalid";
    // Act && Assert
    expect( async() => await retrieveTotalVisitsByStatusAndFacilityIdGateway(container)({ facilityId: invalidId }) ).rejects.toThrowError();
  });
});
