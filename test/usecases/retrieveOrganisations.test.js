import retrieveOrganisations from "../../src/usecases/retrieveOrganisations";

describe("retrieveOrganisations", () => {
  it("returns a list of organsiations", async () => {
    const getRetrieveOrganisationsGateway = jest.fn(() => {
      return jest.fn().mockReturnValue([
        { id: 1, name: "Test Trust1", status: 1 },
        { id: 2, name: "Test Trust2", status: 1 },
      ]);
    });

    const expectedResponse = [
      { id: 1, name: "Test Trust1", status: 1 },
      { id: 2, name: "Test Trust2", status: 1 },
    ];
    const { organisations, error } = await retrieveOrganisations({
      getRetrieveOrganisationsGateway,
    })();
    expect(organisations).toHaveLength(2);
    expect(organisations).toEqual(expectedResponse);
    expect(error).toBeNull();
  });

  it("errors if there is a problem with the database call", async () => {
    const getRetrieveOrganisationsGateway = jest.fn(() => {
      return jest.fn(() => {
        throw new Error();
      });
    });

    const { organisations, error } = await retrieveOrganisations({
      getRetrieveOrganisationsGateway,
    })();

    expect(organisations).toBeNull();
    expect(error).toEqual("There is an error with the database");
  });
});
