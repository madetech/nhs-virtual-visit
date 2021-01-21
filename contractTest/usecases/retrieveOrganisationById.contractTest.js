import retrieveOrganisationById from "../../src/gateways/MsSQL/retrieveOrganisationById";
import { setupOrganisation } from "../../test/testUtils/factories";

describe("retrieveOrganisationById", () => {
  it("returns an object containing the trust", async () => {
    const { orgId } = await setupOrganisation();

    const { organisation, error } = await retrieveOrganisationById(orgId);

    expect(error).toBeNull();
    expect(organisation).toEqual({
      id: orgId,
      name: "Test Trust",
      status: 0,
    });
  });

  it("returns an error when organisation not found for id", async () => {
    const { error } = await retrieveOrganisationById(2000);
    expect(error).toBeDefined();
    expect(error).toEqual("Organisation not found for id");
  });

  it("returns an error when organisation id not set", async () => {
    const { error } = await retrieveOrganisationById();
    expect(error).toBeDefined();
    expect(error).toEqual(
      "Attempting to retrieve organisation with no organisation Id set"
    );
  });
});
