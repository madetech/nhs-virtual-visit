import retrieveTotalBookedVisitsByFacilityIdGateway from "../../../src/gateways/MsSQL/retrieveTotalVisitsByStatusAndFacilityId";
import {
  setupAdminAndOrganisation,
  setUpFacility,
  setUpDepartment,
  setUpScheduledCall,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveTotalBookedVisitsByFacilityIdGateway", () => {
  const container = AppContainer.getInstance();
  it("retrieves scheduled call when given a valid id and department id", async () => {
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
    const total = await retrieveTotalBookedVisitsByFacilityIdGateway(container)(
      facilityOneId
    );
    // Assert
    expect(total).toEqual(3);
  });
  it ("returns 0 when no visits exist", async ()=>{
      // Arrange
      const { adminId, orgId } = await setupAdminAndOrganisation();
      const { facilityId } = await setUpFacility({ createdBy: adminId, orgId });
      await setUpDepartment({ createdBy: adminId, facilityId: facilityId });
     // Act
     const total = await retrieveTotalBookedVisitsByFacilityIdGateway(container)(
      facilityId
    );
    // Assert
    expect(total).toEqual(0);
  })
  it("returns undefined when given invalid facility id", async () => {
    // Arrange
    const idDoesNotExist = 111111111;
    
    // Act
    const total = await retrieveTotalBookedVisitsByFacilityIdGateway(container)(
        idDoesNotExist
      );
    // Assert
    expect(total).toBeDefined();
  });

  it("throws an error when facility id is not an integer", async () => {
    // Arrange
    const invalidId = "invalid";
    // Act && Assert
    expect( async() => await retrieveTotalBookedVisitsByFacilityIdGateway(container)(invalidId) ).rejects.toThrowError();
  });
});
