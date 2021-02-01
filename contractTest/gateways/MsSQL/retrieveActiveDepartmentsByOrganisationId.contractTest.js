import retrieveActiveDepartmentsByOrganisationIdGateway from "../../../src/gateways/MsSQL/retrieveActiveDepartmentsByOrganisationId";
import {
  setUpManager,
  setUpDepartment,
  setupOrganisationAndFacility,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveActiveDepartmentsByOrganisationIdGateway", () => {
  const container = AppContainer.getInstance();

  it("returns an object containing an array of wards", async () => {
    // Arrange
    const email = `${Math.random()}@nhs.co.uk`;
    const {
      user: { id: userId },
    } = await setUpManager({ email });
    const organisationOne = {
      name: "Test Trust 1",
      code: "TT1",
      createdBy: userId,
    };
    const facilityOne = { name: "Test Facility Trust 1", code: "F1T1" };
    const { facilityId, orgId } = await setupOrganisationAndFacility({
      organisationArgs: organisationOne,
      userArgs: { userId },
      facilityArgs: facilityOne,
    });

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
      facilityId,
    });
    const departmentTwoUuid = await setUpDepartment({
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
    // Act
    const departmentsInOrganisationOne = await retrieveActiveDepartmentsByOrganisationIdGateway(
      container
    )(orgId);
    const expectedDepartmentsInOrganisationOne = [
      {
        hospitalName: facilityOne.name,
        wardCode: departmentOne.code,
        wardName: departmentOne.name,
        wardId: currentDepartmentOne.id,
      },
      {
        hospitalName: facilityOne.name,
        wardCode: departmentTwo.code,
        wardName: departmentTwo.name,
        wardId: currentDepartmentTwo.id,
      },
    ];
    // Assert
    expect(departmentsInOrganisationOne).toEqual(
      expectedDepartmentsInOrganisationOne
    );
  });
  it("returns an empty array if there are no departments found", async () => {
    // Arrange
    const email = `${Math.random()}@nhs.co.uk`;
    const {
      user: { id: userId },
    } = await setUpManager({ email });
    const organisationOne = {
      name: "Test Trust 1",
      code: "TT1",
      createdBy: userId,
    };
    const facilityOne = { name: "Test Facility Trust 1", code: "F1T1" };
    const { orgId } = await setupOrganisationAndFacility({
      organisationArgs: organisationOne,
      userArgs: { userId },
      facilityArgs: facilityOne,
    });
    // Act
    const departmentsInOrganisationOne = await retrieveActiveDepartmentsByOrganisationIdGateway(
      container
    )(orgId);
    // Assert
    expect(departmentsInOrganisationOne).toEqual([]);
  });
  it("returns an empty array if organisation id is not found", async () => {
    // Act
    const departmentsInOrganisationOne = await retrieveActiveDepartmentsByOrganisationIdGateway(
      container
    )(20000000);
    // Assert
    expect(departmentsInOrganisationOne).toEqual([]);
  });
});
