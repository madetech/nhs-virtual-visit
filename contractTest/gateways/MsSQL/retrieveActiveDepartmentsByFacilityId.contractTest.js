import retrieveActiveDepartmentsByFacilityIdGateway from "../../../src/gateways/MsSQL/retrieveActiveDepartmentsByFacilityId";
import {
  setupOrganisationFacilityAndManager,
  setUpDepartment,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveActiveDepartmentsByFacilityIdGateway", () => {
  const container = AppContainer.getInstance();
  it("returns an object containing the department", async () => {
    // Arrange
    const { userId, facilityId } = await setupOrganisationFacilityAndManager();

    const departmentOne = {
      name: "Department One",
      code: "DEO",
    };
    const departmentTwo = {
      name: "Department Two",
      code: "DET",
    };
    const { departmentUuid: departmentOneUuid } = await setUpDepartment({
      ...departmentOne,
      createdBy: userId,
      facilityId,
    });
    const { departmentUuid: departmentTwoUuid } = await setUpDepartment({
      ...departmentTwo,
      createdBy: userId,
      facilityId,
    });

    const currentDepartmentOne = await container.getRetrieveDepartmentByUuidGateway()(
      departmentOneUuid
    );
    
    const currentDepartmentTwo = await container.getRetrieveDepartmentByUuidGateway()(
      departmentTwoUuid
    );

    delete currentDepartmentOne["pin"];
    delete currentDepartmentTwo["pin"];

    // Act
    const departments = await retrieveActiveDepartmentsByFacilityIdGateway(
      container
    )(facilityId);
    // Assert
    expect(departments).toEqual([currentDepartmentOne, currentDepartmentTwo]);
  });

  it("returns department as undefined if facility id is undefined", async () => {
    // Arrange
    const departments = await retrieveActiveDepartmentsByFacilityIdGateway(
      container
    )();
    expect(departments).toEqual([]);
  });
});
