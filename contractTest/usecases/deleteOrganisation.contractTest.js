import AppContainer from "../../src/containers/AppContainer";

describe("deleteOrganisation contract tests", () => {
  const container = AppContainer.getInstance();

  it("deletes an organisation", async () => {
    const { organisationId } = await container.getCreateOrganisation()({
      name: "Test Hospital",
      status: 0,
      type: "trust",
      createdBy: 1,
    });

    await container.getDeleteOrganisation()(organisationId);

    const { error } = await container.getRetrieveOrganisationById()(
      organisationId
    );

    expect(error).toEqual("Organisation not found for id");
  });
});
