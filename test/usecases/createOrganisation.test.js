import createOrganisation from "../../src/usecases/createOrganisation";

describe("retrieveOrganisationById", () => {
  it("returns a trust with the given Id", async () => {
    const getCreateOrganisationGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        organisation: {
          id: 1,
          name: "Test Trust",
          created_by: 1,
          type: "trust",
        },
        error: null,
      });
    });

    const newOrganisation = {
      name: "Test Trust",
      type: "trust",
      createdBy: 1,
    };

    const { organisationId, error } = await createOrganisation({
      getCreateOrganisationGateway,
    })(newOrganisation);
    expect(organisationId).toEqual(1);
    expect(error).toBeNull();
  });

  it("errors if there is a problem with the database call", async () => {
    const getCreateOrganisationGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        organisation: null,
        error: "There is an error with the database",
      });
    });

    const newOrganisation = {
      name: "Test Trust",
      type: "trust",
      createdBy: 1,
    };

    const { organisationId, error } = await createOrganisation({
      getCreateOrganisationGateway,
    })(newOrganisation);

    expect(organisationId).toBeFalsy();
    expect(error).toEqual("There is an error with the database");
  });
});
