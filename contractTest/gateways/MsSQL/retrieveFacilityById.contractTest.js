import retrieveFacilityByIdGateWay from "../../../src/gateways/MsSQL/retrieveFacilityById";
import { setupOrganisationFacilityAndManager } from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveFacilityById", () => {
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
    const facility = await retrieveFacilityByIdGateWay(container)(facilityId);
    // Assert
    expect(facility).toEqual({
      id: facilityId,
      uuid: facilityUuid,
      status: 1,
      ...facilityArgs,
    });
  });
  it("returns undefined if uuid is undefined", async () => {
    // Arrange && Act && Assert
    const facility = await retrieveFacilityByIdGateWay(container)(undefined);
    expect(facility).toBeUndefined();
  });
});
