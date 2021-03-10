import retrieveTotalBookedVisitsForDepartmentsByFacilityIdGateway from "../../../src/gateways/MsSQL/retrieveTotalBookedVisitsForDepartmentsByFacilityId";
import {
  setupAdminAndOrganisation,
  setUpFacility,
  setUpDepartment,
  setUpScheduledCall,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveTotalBookedVisitsForDepartmentsByFacilityIdGateway", () => {
  const container = AppContainer.getInstance();
  it("retrieves the correct array of departments given a valid facility id", async () => {
    // Arrange
    const { adminId, orgId } = await setupAdminAndOrganisation();
    const { facilityId: facilityOneId } = await setUpFacility({ createdBy: adminId, orgId });
    const { facilityId: facilityTwoId } = await setUpFacility({ createdBy: adminId, orgId });
    const { departmentId: departmentOneId } = await setUpDepartment({ 
        createdBy: adminId, 
        facilityId: facilityOneId,
        name: "Department One",
    });
    const { departmentId: departmentTwoId } = await setUpDepartment({ 
        createdBy: adminId, 
        facilityId: facilityOneId,
        name: "Department Two"
    });
    const { departmentId: departmentThreeId } = await setUpDepartment({ createdBy: adminId, facilityId: facilityTwoId });
  
    await setUpScheduledCall({ departmentId: departmentOneId });
    await setUpScheduledCall({ departmentId: departmentOneId });
    await setUpScheduledCall({ departmentId: departmentTwoId });
    await setUpScheduledCall({ departmentId: departmentThreeId });

    // Act
    const departmentArray = await retrieveTotalBookedVisitsForDepartmentsByFacilityIdGateway(container)(
      facilityOneId
    );
    // Assert
    expect(departmentArray.length).toEqual(2);
    expect(departmentArray.find(department => department.name === "Department One").total).toEqual(2);
    expect(departmentArray.find(department => department.name === "Department Two").total).toEqual(1);
  });
  it ("returns an array with total visit 0 when no visits exist", async ()=>{
      // Arrange
      const { adminId, orgId } = await setupAdminAndOrganisation();
      const { facilityId } = await setUpFacility({ createdBy: adminId, orgId });
      await setUpDepartment({ createdBy: adminId, facilityId: facilityId });
     // Act
     const departmentArray = await retrieveTotalBookedVisitsForDepartmentsByFacilityIdGateway(container)(
      facilityId
    );
    // Assert
    expect(departmentArray.length).toEqual(1);
    expect(departmentArray[0].total).toEqual(0);
  })
  it ("returns an empty array when no departments exist", async ()=>{
    // Arrange
    const { adminId, orgId } = await setupAdminAndOrganisation();
    const { facilityId } = await setUpFacility({ createdBy: adminId, orgId });
   // Act
   const departmentArray = await retrieveTotalBookedVisitsForDepartmentsByFacilityIdGateway(container)(
    facilityId
  );
  // Assert
  expect(departmentArray.length).toEqual(0);
})
  it("returns undefined when given invalid facility id", async () => {
    // Arrange
    const idDoesNotExist = 111111111;
    
    // Act
    const total = await retrieveTotalBookedVisitsForDepartmentsByFacilityIdGateway(container)(
        idDoesNotExist
      );
    // Assert
    expect(total).toBeDefined();
  });

  it("throws an error when facility id is not an integer", async () => {
    // Arrange
    const invalidId = "invalid";
    // Act && Assert
    expect( async() => await retrieveTotalBookedVisitsForDepartmentsByFacilityIdGateway(container)(invalidId) ).rejects.toThrowError();
  });
});
