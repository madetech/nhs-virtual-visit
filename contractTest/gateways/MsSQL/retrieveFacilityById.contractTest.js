import retrieveFacilityByIdGateWay from "../../../src/gateways/MsSQL/retrieveFacilityById";
import {
  setupOrganization,
  setUpManager,
  setUpFacility,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveFacilityById", () => {
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
    const uuid = await setUpFacility({ orgId, createdBy: userId });
    const currentFacility = await container.getRetrieveFacilityByUuidGateway()(
      uuid
    );
    // Act
    const facility = await retrieveFacilityByIdGateWay(container)(
      currentFacility.id
    );
    // Assert
    expect(facility).toEqual({
      id: currentFacility.id,
      name: "Test Facility One",
      code: "TF1",
      uuid,
      status: 1,
    });
  });
  it("returns undefined if uuid is undefined", async () => {
    // Arrange && Act && Assert
    const facility = await retrieveFacilityByIdGateWay(container)(undefined);
    expect(facility).toBeUndefined();
  });
});
