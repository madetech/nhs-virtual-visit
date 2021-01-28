import retrieveActiveDepartmentsByFacilityIdGateway from "../../../src/gateways/MsSQL/retrieveActiveDepartmentsByFacilityId";
import {
  setupOrganization,
  setUpManager,
  setUpFacility,
  setUpDepartment,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveActiveDepartmentsByFacilityIdGateway", () => {
  const container = AppContainer.getInstance();
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
    const departmentOne = {
      name: "Department One",
      code: "DEO",
    };
    const departmentTwo = {
      name: "Department Two",
      code: "DET",
    };
    const departmentOneUuid = await setUpDepartment({
      ...departmentOne,
      createdBy: userId,
      facilityId: facility.id,
    });
    const departmentTwoUuid = await setUpDepartment({
      ...departmentTwo,
      createdBy: userId,
      facilityId: facility.id,
    });

    const currentDepartmentOne = await container.getRetrieveDepartmentByUuidGateway()(
      departmentOneUuid
    );
    const currentDepartmentTwo = await container.getRetrieveDepartmentByUuidGateway()(
      departmentTwoUuid
    );
    // Act

    const departments = await retrieveActiveDepartmentsByFacilityIdGateway(
      container
    )(facility.id);
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
