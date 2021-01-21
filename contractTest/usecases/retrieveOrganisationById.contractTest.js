import AppContainer from "../../src/containers/AppContainer";
import { setupOrganization } from "../../test/testUtils/factories";

describe("retrieveOrganisation usecase contract tests", () => {
  // Arrange
  const container = AppContainer.getInstance();
  it("returns an organisation", async () => {
    // Arange
    const {
      organisation: { id },
    } = await setupOrganization();
    // Act
    const {
      organisation,
      error,
    } = await container.getRetrieveOrganisationById()(id);
    // Assert
    expect(organisation).toEqual({
      id: id,
      name: "Test Trust",
      uuid: organisation.uuid,
    });
    expect(error).toBeNull();
  });
  it("returns an error when organisation id is not provided", async () => {
    // Act
    const { error } = await container.getRetrieveOrganisationById()();
    // Assert
    expect(error).toEqual("id must be provided.");
  });
});
