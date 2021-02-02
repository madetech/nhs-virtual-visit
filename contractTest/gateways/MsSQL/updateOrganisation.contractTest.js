import updateOrganisationGateway from "../../../src/gateways/MsSQL/updateOrganisation";
import AppContainer from "../../../src/containers/AppContainer";
import { setupOrganisationAndManager } from "../../../test/testUtils/factories";

describe("updateOrganisation contract tests", () => {
  const container = AppContainer.getInstance();
  it("updates an organisation", async () => {
    const { orgId: id } = await setupOrganisationAndManager();
    const name = "Changed Trust Name";

    const { organisation, error } = await updateOrganisationGateway(container)({
      id,
      name,
    });

    expect(error).toBeNull();
    expect(organisation.name).toEqual(name);
    expect(organisation.id).toEqual(id);
  });

  it("returns error if the id isn't found in the database", async () => {
    await setupOrganisationAndManager();
    const name = "Changed Trust Name";
    const invalidId = 1000000;
    const { organisation, error } = await updateOrganisationGateway(container)({
      id: invalidId,
      name,
    });

    expect(organisation).toBeNull();
    expect(error).toEqual(
      "The organisation could not be found in the database"
    );
  });
});
