import retrieveOrganisationById from "../../src/usecases/retrieveOrganisationById";

describe("retrieveActiveOrganisations", () => {
  it("returns a list of organsiations that have and active status", async () => {
    const getRetrieveOrganisationByIdGateway = jest.fn(() => {
      return jest
        .fn()
        .mockReturnValue({ id: 1, name: "Active Trust", status: 1 });
    });

    const { organisation, error } = await retrieveOrganisationById({
      getRetrieveOrganisationByIdGateway,
    })();
    expect(organisation.name).toEqual("Active Trust");
    expect(error).toBeNull();
  });

  it("errors if there is a problem with the database call", async () => {
    const getRetrieveOrganisationByIdGateway = jest.fn(() => {
      return jest.fn(() => {
        throw new Error();
      });
    });

    const { organisation, error } = await retrieveOrganisationById({
      getRetrieveOrganisationByIdGateway,
    })();

    expect(organisation).toBeNull();
    expect(error).toEqual("There is an error with the database");
  });
});
