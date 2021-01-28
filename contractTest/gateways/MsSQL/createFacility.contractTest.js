import createFacility from "../../../src/gateways/MsSQL/createFacility";
import {
  setupOrganization,
  setUpManager,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("createFacility", () => {
  const container = AppContainer.getInstance();
  const facilityArgs = {
    name: "Test Facility One",
    code: "TF1",
  };
  it("returns an object containing the facility", async () => {
    // Arrange
    const {
      organisation: { id: orgId },
    } = await setupOrganization();
    const email = `${Math.random()}@nhs.co.uk`;
    const {
      user: { id: userId },
    } = await setUpManager({ organisationId: orgId, email });
    const uuid = await createFacility(container)({
      ...facilityArgs,
      orgId,
      createdBy: userId,
    });
    // Act
    const { facility, error } = await container.getRetrieveFacilityByUuid(
      container
    )(uuid);
    // Assert
    expect(error).toBeNull();
    expect(facility).toEqual({
      ...facilityArgs,
      id: facility.id,
      uuid,
      status: "active",
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
      const {
        organisation: { id: orgId },
      } = await setupOrganization();
      const email = `${Math.random()}@nhs.co.uk`;
      const {
        user: { id: userId },
      } = await setUpManager({ organisationId: orgId, email });
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
      const {
        organisation: { id: orgId },
      } = await setupOrganization();
      const email = `${Math.random()}@nhs.co.uk`;
      const {
        user: { id: userId },
      } = await setUpManager({ organisationId: orgId, email });
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
      const {
        organisation: { id: orgId },
      } = await setupOrganization();
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
