import updateFacilityByIdGateway from "../../../src/gateways/MsSQL/updateFacilityById";
import { setupOrganisationFacilityAndManager } from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("updateFacilityByIdGateway", () => {
  const container = AppContainer.getInstance();
  const facilityToBeUpdated = {
    name: "Test Facility One Updated",
  };
  let ids;
  beforeEach(async () => {
    ids = await setupOrganisationFacilityAndManager();
  });
  it("updates a facility", async () => {
    // Arrange
    const { facilityId, facilityUuid } = ids;
    const currentFacility = await container.getRetrieveFacilityByUuidGateway()(
      facilityUuid
    );
    // Act
    await updateFacilityByIdGateway(container)({
      id: facilityId,
      ...facilityToBeUpdated,
    });
    const updatedFacility = await container.getRetrieveFacilityByUuidGateway()(
      facilityUuid
    );
    // Assert
    expect(updatedFacility).toEqual({
      ...currentFacility,
      ...facilityToBeUpdated,
    });
  });
  describe("throws an error", () => {
    it("name is undefined", async () => {
      // Arrange
      const { facilityId } = ids;
      // Act && Assert
      expect(
        async () =>
          await updateFacilityByIdGateway(container)({
            id: facilityId,
            ...facilityToBeUpdated,
            name: undefined,
          })
      ).rejects.toThrow();
    });
    it("id is undefined", async () => {
      // Act && Assert
      expect(
        async () =>
          await updateFacilityByIdGateway(container)({
            id: undefined,
            ...facilityToBeUpdated,
          })
      ).rejects.toThrow();
    });
  });
});
