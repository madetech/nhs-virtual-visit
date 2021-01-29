import retrieveOrganisationById from "../../../src/gateways/MsSQL/retrieveOrganisationById";
import { setupOrganization } from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";
import setupUser from "../../../test/testUtils/setupUser";

describe("retrieveOrganisationById", () => {
  // Arrange
  const container = AppContainer.getInstance();
  it("returns an object containing the trust", async () => {
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
    const { organisation, error } = await retrieveOrganisationById(container)(
      id
    );
    // Assert
    expect(error).toBeNull();
    expect(organisation).toEqual({
      id: id,
      name: "Test Trust",
      type: "trust",
      status: 0,
      created_by: userId,
      created_at: organisation.created_at,
      uuid: organisation.uuid,
    });
  });
  it("returns an error when organisation not found for id", async () => {
    // Act
    const { error } = await retrieveOrganisationById(container)(2000);
    // Assert
    expect(error).toBeDefined();
    expect(error).toEqual("Organisation not found for id");
  });

  it("returns an error when organisation id not set", async () => {
    // Act
    const { error } = await retrieveOrganisationById(container)();
    // Assert
    expect(error).toBeDefined();
    expect(error).toEqual("Organisation not found for id");
  });
});
