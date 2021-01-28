import retrieveFacilitiesByOrgIdGateWay from "../../../src/gateways/MsSQL/retrieveFacilitiesByOrgId";
import {
  setupOrganization,
  setUpManager,
  setUpFacility,
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
    // Act
    const facilities = await retrieveFacilitiesByOrgIdGateWay(container)({
      orgId,
    });
    // // Assert
    expect(facilities).toEqual([currentFacilityOne, currentFacilityTwo]);
  });
  it("returns [] if orgId is undefined", async () => {
    // Arrange && Act && Assert
    const facility = await retrieveFacilitiesByOrgIdGateWay(container)({
      orgId: undefined,
    });
    expect(facility).toEqual([]);
  });
});
