import updateFacilityByIdGateway from "../../../src/gateways/MsSQL/updateFacilityById";
import {
  setupOrganization,
  setUpManager,
  setUpFacility,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("updateFacilityByIdGateway", () => {
  const container = AppContainer.getInstance();
  const facilityToBeUpdated = {
    name: "Test Facility One Updated",
    status: 0,
  };
  it("updates a facility", async () => {
    // Arrange
    const {
      organisation: { id: orgId },
    } = await setupOrganization();
    const email = `${Math.random()}@nhs.co.uk`;
    const {
      user: { id: userId },
    } = await setUpManager({ organisationId: orgId, email });
    const uuid = await setUpFacility({
      orgId,
      createdBy: userId,
    });
    const currentFacility = await container.getRetrieveFacilityByUuidGateway()(
      uuid
    );
    // Act
    await updateFacilityByIdGateway(container)({
      id: currentFacility.id,
      ...facilityToBeUpdated,
    });
    const updatedFacility = await container.getRetrieveFacilityByUuidGateway()(
      uuid
    );
    // Assert
    expect(updatedFacility).toEqual({
      ...currentFacility,
      status: facilityToBeUpdated.status,
      name: facilityToBeUpdated.name,
    });
  });
  describe("throws an error", () => {
    it("name is undefined", async () => {
      // Arrange
      const {
        organisation: { id: orgId },
      } = await setupOrganization();
      const email = `${Math.random()}@nhs.co.uk`;
      const {
        user: { id: userId },
      } = await setUpManager({ organisationId: orgId, email });
      const uuid = await setUpFacility({
        orgId,
        createdBy: userId,
      });
      const currentFacility = await container.getRetrieveFacilityByUuidGateway()(
        uuid
      );
      // Act
      expect(
        async () =>
          await updateFacilityByIdGateway(container)({
            id: currentFacility.id,
            ...facilityToBeUpdated,
            name: undefined,
          })
      ).rejects.toThrow();
    });
    it("id is undefined", async () => {
      // Arrange
      const {
        organisation: { id: orgId },
      } = await setupOrganization();
      const email = `${Math.random()}@nhs.co.uk`;
      const {
        user: { id: userId },
      } = await setUpManager({ organisationId: orgId, email });
      await setUpFacility({ orgId, createdBy: userId });
      // Act
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
