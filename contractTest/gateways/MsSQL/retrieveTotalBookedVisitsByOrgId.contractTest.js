import retrieveTotalBookedVisitsByOrgIdGateway from "../../../src/gateways/MsSQL/retrieveTotalBookedVisitsByOrgId";
import {
  setupAdminAndOrganisation,
  setUpFacility,
  setupOrganization,
  setUpDepartment,
  setUpScheduledCall,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveTotalBookedVisitsByOrgIdGateway", () => {
  const container = AppContainer.getInstance();
  it("retrieves scheduled call when given a valid id and department id", async () => {
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
    const total = await retrieveTotalBookedVisitsByOrgIdGateway(container)(
      orgOneId
    );
    // Assert
    expect(total).toEqual(4);
  });
  it ("returns 0 when no visits exist", async ()=>{
      // Arrange
      const { adminId, orgId } = await setupAdminAndOrganisation();
      const { facilityId } = await setUpFacility({ createdBy: adminId, orgId });
      await setUpDepartment({ createdBy: adminId, facilityId: facilityId });
     // Act
     const total = await retrieveTotalBookedVisitsByOrgIdGateway(container)(
      orgId
    );
    // Assert
    expect(total).toEqual(0);
  })
  it("returns undefined when given invalid facility id", async () => {
    // Arrange
    const idDoesNotExist = 111111111;
    
    // Act
    const total = await retrieveTotalBookedVisitsByOrgIdGateway(container)(
        idDoesNotExist
      );
    // Assert
    expect(total).toBeDefined();
  });

  it("throws an error when facility id is not an integer", async () => {
    // Arrange
    const invalidId = "invalid";
    // Act && Assert
    expect( async() => await retrieveTotalBookedVisitsByOrgIdGateway(container)(invalidId) ).rejects.toThrowError();
  });
});
