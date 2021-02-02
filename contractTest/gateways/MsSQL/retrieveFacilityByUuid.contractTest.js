import retrieveFacilityByUuidGateWay from "../../../src/gateways/MsSQL/retrieveFacilityByUuid";
import { setupOrganisationFacilityAndManager } from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveFacilityByUuid", () => {
  const container = AppContainer.getInstance();
  const facilityArgs = {
    name: "Test Facility One",
    code: "TF1",
  };
  it("returns an object containing the facility", async () => {
    // Arrange
    const {
      facilityId,
      facilityUuid,
    } = await setupOrganisationFacilityAndManager({
      facilityArgs,
    });
    // Act
    const facility = await retrieveFacilityByUuidGateWay(container)(
      facilityUuid
    );
    // Assert
    expect(facility).toEqual({
      id: facilityId,
      name: "Test Facility One",
      code: "TF1",
      uuid: facilityUuid,
      status: 1,
    });
  });
  it("returns undefined if uuid is undefined", async () => {
    // Arrange && Act && Assert
    const facility = await retrieveFacilityByUuidGateWay(container)(undefined);
    expect(facility).toBeUndefined();
  });
});
