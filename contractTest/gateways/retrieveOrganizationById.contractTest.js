import retrieveOrganizationById from "../../src/gateways/retrieveOrganizationById";
import { setupOrganization } from "../../test/testUtils/factories";

describe("retrieveOrganizationById", () => {
  it("returns an object containing the organization", async () => {
    const { organizationId } = await setupOrganization();

    const { organization, error } = await retrieveOrganizationById(
      organizationId
    );

    expect(error).toBeNull();
    expect(organization).toEqual({
      id: organizationId,
      name: "Test Trust",
      status: 0,
    });
  });

  it("returns an error when organization not found for id", async () => {
    const { error } = await retrieveOrganizationById(12);
    expect(error).toBeDefined();
    expect(error).toEqual("Organization not found for id");
  });

  it("returns an error when organization id not set", async () => {
    const { error } = await retrieveOrganizationById();
    expect(error).toBeDefined();
    expect(error).toEqual(
      "Attempting to retrieve organization with no organization ID set"
    );
  });
});
