import createFacility from "../../../src/gateways/MsSQL/createFacility";
import { setupOrganisationAndManager } from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("createFacility", () => {
  const container = AppContainer.getInstance();
  const facilityArgs = {
    name: "Test Facility One",
    code: "TF1",
  };
  let ids;
  beforeEach(async () => {
    ids = await setupOrganisationAndManager();
  });
  it("returns an object containing the facility", async () => {
    // Arrange
    const { orgId, userId } = ids;
    const uuid = await createFacility(container)({
      ...facilityArgs,
      orgId,
      createdBy: userId,
    });
    // Act
    const facility = await container.getRetrieveFacilityByUuidGateway(
      container
    )(uuid);
    // Assert
    expect(facility).toEqual({
      ...facilityArgs,
      id: facility.id,
      uuid,
      status: 1,
    });
  });
  describe("throws an error", () => {
    it("name is undefined", async () => {
      // Arrange
      const { orgId, userId } = ids;
      // Act && Assert
      expect(
        async () =>
          await createFacility(container)({
            ...facilityArgs,
            name: undefined,
            orgId,
            createdBy: userId,
          })
      ).rejects.toThrow();
    });
    it("orgId is undefined", async () => {
      // Arrange
      const { userId } = ids;
      // Act && Assert
      expect(
        async () =>
          await createFacility(container)({
            ...facilityArgs,
            orgId: undefined,
            createdBy: userId,
          })
      ).rejects.toThrow();
    });
    it("code is undefined", async () => {
      // Arrange
      const { orgId, userId } = ids;
      // Act && Assert
      expect(
        async () =>
          await createFacility(container)({
            ...facilityArgs,
            code: undefined,
            orgId,
            createdBy: userId,
          })
      ).rejects.toThrow();
    });
    it("createdBy is undefined", async () => {
      // Arrange
      const { orgId } = ids;
      // Act && Assert
      expect(
        async () =>
          await createFacility(container)({
            ...facilityArgs,
            createdBy: undefined,
            orgId,
          })
      ).rejects.toThrow();
    });
  });
});
