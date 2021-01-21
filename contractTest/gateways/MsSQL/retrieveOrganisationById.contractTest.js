import retrieveOrganisationById from "../../../src/gateways/MsSQL/retrieveOrganisationById";
import { setupOrganization } from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveOrganisationById", () => {
  // Arrange
  const container = AppContainer.getInstance();
  it("returns an object containing the trust", async () => {
    // Arrange
    const {
      organisation: { id },
    } = await setupOrganization();
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
      created_by: 1,
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
