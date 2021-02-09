import activateOrganisationGateway from "../../../src/gateways/MsSQL/activateOrganisation";
import AppContainer from "../../../src/containers/AppContainer";
import { setupAdminAndOrganisation } from "../../../test/testUtils/factories";
import { statusToId, ACTIVE } from "../../../src/helpers/statusTypes";

describe("activateOrganisationGateway", () => {
  const container = AppContainer.getInstance();
  let orgId;
  beforeEach(async () => {
    const result = await setupAdminAndOrganisation();
    orgId = result.orgId;
  });
  it("updates an organisation status given its organisation id", async () => {
    // Arrange
    const statusToUpdate = statusToId(ACTIVE);
    // Act
    const { organisation, error } = await activateOrganisationGateway(
      container
    )({
      organisationId: orgId,
      status: statusToUpdate,
    });
    // Assert
    expect(error).toBeNull();
    expect(organisation.status).toEqual(statusToUpdate);
    expect(organisation.id).toEqual(orgId);
  });
  it("returns error if the id isn't found in the database", async () => {
    // Arrange
    const statusToUpdate = statusToId(ACTIVE);
    const invalidId = 1000000;
    // Act
    const { organisation, error } = await activateOrganisationGateway(
      container
    )({
      organisationId: invalidId,
      status: statusToUpdate,
    });
    // Assert
    expect(organisation).toBeNull();
    expect(error).toEqual("Error activating organisation");
  });
  it("returns error if the status is not a number", async () => {
    // Arrange
    const statusToUpdate = "active";
    // Act
    const { organisation, error } = await activateOrganisationGateway(
      container
    )({
      organisationId: orgId,
      status: statusToUpdate,
    });
    // Assert
    expect(organisation).toBeNull();
    expect(error).toBeTruthy();
  });
});
