import createFacility from "../../../src/gateways/MsSQL/createFacility";
import {
  setupOrganization,
  setUpManager,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("createFacility", () => {
  const container = AppContainer.getInstance();
  it("returns an object containing the facility", async () => {
    // Arrange
    const {
      organisation: { id: orgId },
    } = await setupOrganization();
    const email = `${Math.random()}@nhs.co.uk`;
    const {
      user: { id: userId },
    } = await setUpManager({ organisationId: orgId, email });

    const facilityArgs = {
      name: "Test Facility One",
      code: "TF1",
    };
    const uuid = await createFacility(container)({
      ...facilityArgs,
      orgId,
      createdBy: userId,
    });
    // Act
    const { facility, error } = await container.getRetrieveFacilityByUuid(
      container
    )(uuid);
    console.log(facility);
    // Assert
    expect(error).toBeNull();
    expect(facility).toEqual({
      ...facilityArgs,
      id: facility.id,
      uuid,
      status: "active",
    });
  });
});
