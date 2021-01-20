import retrieveOrganisationById from "../../src/usecases/retrieveOrganisationById";

describe("retrieveOrganisationById", () => {
  it("returns a trust with the given Id", async () => {
    const getRetrieveOrganisationByIdGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        organisation: { id: 1, name: "Test Trust", status: 1 },
        error: null,
      });
    });

    const organisationId = 1;
    const { organisation, error } = await retrieveOrganisationById({
      getRetrieveOrganisationByIdGateway,
    })(organisationId);
    expect(organisation.name).toEqual("Test Trust");
    expect(error).toBeNull();
  });

  it("errors if there is a problem with the database call", async () => {
    const getRetrieveOrganisationByIdGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        organisation: null,
        error: "There is an error with the database",
      });
    });

    const organisationId = 1;
    const { organisation, error } = await retrieveOrganisationById({
      getRetrieveOrganisationByIdGateway,
    })(organisationId);

    expect(organisation).toBeFalsy();
    expect(error).toEqual("There is an error with the database");
  });
});
