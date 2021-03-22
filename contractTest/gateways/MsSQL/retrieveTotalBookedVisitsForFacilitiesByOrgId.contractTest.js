import retrieveTotalBookedVisitsForFacilitiesByOrgIdGateway from "../../../src/gateways/MsSQL/retrieveTotalBookedVisitsForFacilitiesByOrgId";
import {
  setupAdminAndOrganisation,
  setUpFacility,
  setupOrganization,
  setUpDepartment,
  setUpScheduledCall,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveTotalBookedVisitsForFacilitiesByOrgIdGateway", () => {
  const container = AppContainer.getInstance();
  it("retrieves an array of departments showing correct number total visits when given a valid org id", async () => {
    // Arrange
    const { adminId, orgId: orgOneId } = await setupAdminAndOrganisation();
    const { organisation: { id: orgTwoId } } = await setupOrganization({ createdBy: adminId });
    const { facilityId: facilityOneId } = await setUpFacility({ 
        createdBy: adminId, 
        orgId: orgOneId,
        name: "Hospital One",
    });
    const { facilityId: facilityTwoId } = await setUpFacility({ 
        createdBy: adminId, 
        orgId: orgOneId,
        name: "Hospital Two",
    });
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
    const facilityArray = await retrieveTotalBookedVisitsForFacilitiesByOrgIdGateway(container)(
      orgOneId
    );
    // Assert
    expect(facilityArray.length).toEqual(2);
    expect(facilityArray.find(facility => facility.name == "Hospital One").total).toEqual(3);
    expect(facilityArray.find(facility => facility.name == "Hospital Two").total).toEqual(1);
  });
  it ("returns an array with total visit 0 when no visits exist", async ()=>{
      // Arrange
      const { adminId, orgId } = await setupAdminAndOrganisation();
      const { facilityId } = await setUpFacility({ createdBy: adminId, orgId });
      await setUpDepartment({ createdBy: adminId, facilityId: facilityId });
      // Act
      const facilityArray = await retrieveTotalBookedVisitsForFacilitiesByOrgIdGateway(container)(
      orgId
    );
    // Assert
    expect(facilityArray.length).toEqual(1);
    expect(facilityArray[0].total).toEqual(0);
  })
  it ("returns an empty array when no visits facility exists", async ()=>{
    // Arrange
    const { orgId } = await setupAdminAndOrganisation();
   // Act
   const facilityArray = await retrieveTotalBookedVisitsForFacilitiesByOrgIdGateway(container)(
    orgId
  );
  // Assert
  expect(facilityArray.length).toEqual(0);
})
  it("returns undefined when given invalid org id", async () => {
    // Arrange
    const idDoesNotExist = 111111111;
    
    // Act
    const facilityArray = await retrieveTotalBookedVisitsForFacilitiesByOrgIdGateway(container)(
        idDoesNotExist
      );
    // Assert
    expect(facilityArray).toBeDefined();
  });

  it("throws an error when org id is not an integer", async () => {
    // Arrange
    const invalidId = "invalid";
    // Act && Assert
    expect( async() => await retrieveTotalBookedVisitsForFacilitiesByOrgIdGateway(container)(invalidId) ).rejects.toThrowError();
  });
});
