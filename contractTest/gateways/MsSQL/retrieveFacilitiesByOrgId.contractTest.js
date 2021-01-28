import retrieveFacilitiesByOrgIdGateWay from "../../../src/gateways/MsSQL/retrieveFacilitiesByOrgId";
import {
  setupOrganization,
  setUpManager,
  setUpFacility,
  setUpDepartment,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveFacilitiesByOrgIdGateWay", () => {
  const container = AppContainer.getInstance();

  it("returns an object containing the facilities when no options is passed", async () => {
    // Arrange
    const facilityOne = {
      name: "Facility Test One",
      code: "FT1",
    };
    const facilityTwo = {
      name: "Facility Test Two",
      code: "FT2",
    };

    const {
      organisation: { id: orgId },
    } = await setupOrganization();

    const email = `${Math.random()}@nhs.co.uk`;
    const {
      user: { id: userId },
    } = await setUpManager({ organisationId: orgId, email });

    const facilityOneUuid = await setUpFacility({
      ...facilityOne,
      orgId,
      createdBy: userId,
    });
    const facilityTwoUuid = await setUpFacility({
      ...facilityTwo,
      orgId,
      createdBy: userId,
    });

    const currentFacilityOne = await container.getRetrieveFacilityByUuidGateway()(
      facilityOneUuid
    );
    const currentFacilityTwo = await container.getRetrieveFacilityByUuidGateway()(
      facilityTwoUuid
    );
    // Act
    const facilities = await retrieveFacilitiesByOrgIdGateWay(container)({
      orgId,
    });
    // // Assert
    expect(facilities).toEqual([currentFacilityOne, currentFacilityTwo]);
  });
  it("returns an object containing the facilities with wards when withWards args is true", async () => {
    // Arrange
    const facilityOne = {
      name: "Facility Test One",
      code: "FT1",
    };
    const facilityTwo = {
      name: "Facility Test Two",
      code: "FT2",
    };

    const {
      organisation: { id: orgId },
    } = await setupOrganization();

    const email = `${Math.random()}@nhs.co.uk`;
    const {
      user: { id: userId },
    } = await setUpManager({ organisationId: orgId, email });

    const facilityOneUuid = await setUpFacility({
      ...facilityOne,
      orgId,
      createdBy: userId,
    });
    const facilityTwoUuid = await setUpFacility({
      ...facilityTwo,
      orgId,
      createdBy: userId,
    });

    const currentFacilityOne = await container.getRetrieveFacilityByUuidGateway()(
      facilityOneUuid
    );
    const currentFacilityTwo = await container.getRetrieveFacilityByUuidGateway()(
      facilityTwoUuid
    );
    const departmentOne = {
      name: "Department One",
      code: "DP1",
    };
    const departmentTwo = {
      name: "Department Two",
      code: "DP2",
    };
    const departmentOneUuid = await setUpDepartment({
      ...departmentOne,
      facilityId: currentFacilityOne.id,
      createdBy: userId,
    });

    const departmentTwoUuid = await setUpDepartment({
      ...departmentTwo,
      facilityId: currentFacilityTwo.id,
      createdBy: userId,
    });
    const currentDepartmentOne = await container.getRetrieveDepartmentByUuidGateway()(
      departmentOneUuid
    );
    const currentDepartmentTwo = await container.getRetrieveDepartmentByUuidGateway()(
      departmentTwoUuid
    );
    // Act
    const facilities = await retrieveFacilitiesByOrgIdGateWay(container)({
      orgId,
      options: { withWards: true },
    });
    // // Assert
    expect(facilities).toEqual([
      {
        ...currentFacilityOne,
        departments: [
          { name: currentDepartmentOne.name, id: currentDepartmentOne.id },
        ],
      },
      {
        ...currentFacilityTwo,
        departments: [
          { name: currentDepartmentTwo.name, id: currentDepartmentTwo.id },
        ],
      },
    ]);
  });
  it("returns [] if orgId is undefined", async () => {
    // Arrange && Act && Assert
    const facility = await retrieveFacilitiesByOrgIdGateWay(container)({
      orgId: undefined,
    });
    expect(facility).toEqual([]);
  });
});
