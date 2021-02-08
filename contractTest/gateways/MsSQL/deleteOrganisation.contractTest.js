import deleteOrganisationGateway from "../../../src/gateways/MsSQL/deleteOrganisation";
import { setupAdminAndOrganisation } from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("deleteOrganisationGateway", () => {
  // Arrange
  const container = AppContainer.getInstance();
  it("deletes an organisation", async () => {
    // Arrange
    const { orgId } = await setupAdminAndOrganisation();
    // Act
    const { error: deleteError } = await deleteOrganisationGateway(container)(
      orgId
    );
    const {
      organisation,
      error: retrieveError,
    } = await container.getRetrieveOrganisationByIdGateway()(orgId);

    // Assert
    expect(deleteError).toBeNull();
    expect(organisation).toBeNull();
    expect(retrieveError).toEqual("Organisation not found for id");
  });
  it("returns an error when organisation not found for id", async () => {
    // Act
    const { error } = await deleteOrganisationGateway(container)(200000);
    // Assert
    expect(error).toEqual("Error deleting organisation with id");
  });
});
