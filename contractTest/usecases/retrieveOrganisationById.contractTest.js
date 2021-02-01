import AppContainer from "../../src/containers/AppContainer";
import { setupOrganization } from "../../test/testUtils/factories";
import setupUser from "../../test/testUtils/setupUser";

describe("retrieveOrganisation usecase contract tests", () => {
  // Arrange
  const container = AppContainer.getInstance();
  it("returns an organisation", async () => {
    // Arrange
    const { id: userId } = await setupUser(container)({
      email: "default@example.com",
      password: "testpassword",
      type: "Default",
    });

    const {
      organisation: { id },
    } = await setupOrganization({ createdBy: userId });
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
    expect(error).toEqual("organisationId is not defined");
  });
});
