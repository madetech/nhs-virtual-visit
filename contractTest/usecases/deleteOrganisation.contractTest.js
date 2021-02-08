import AppContainer from "../../src/containers/AppContainer";
import { setUpManager } from "../../test/testUtils/factories";

describe.skip("deleteOrganisation contract tests", () => {
  const container = AppContainer.getInstance();

  it("deletes an organisation", async () => {
    const {
      user: { id: userId },
    } = await setUpManager();

    const { organisationId } = await container.getCreateOrganisation()({
      name: "Test Hospital",
      status: 0,
      type: "trust",
      createdBy: userId,
    });

    await container.getDeleteOrganisation()(organisationId);

    const { error } = await container.getRetrieveOrganisationById()(
      organisationId
    );

    expect(error).toEqual("Organisation not found for id");
  });
});
