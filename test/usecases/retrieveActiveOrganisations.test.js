import retrieveActiveOrganisations from "../../src/usecases/retrieveActiveOrganisations";
import logger from "../../logger";

describe("retrieveActiveOrganisations", () => {
  it("returns a list of organsiations that have and active status", async () => {
    const getRetrieveActiveOrganisationsGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        organisations: [
          { id: 1, name: "Test Trust1", status: 1 },
          { id: 2, name: "Test Trust2", status: 1 },
        ],
        error: null,
      });
    });

    const expectedResponse = [
      { id: 1, name: "Test Trust1", status: 1 },
      { id: 2, name: "Test Trust2", status: 1 },
    ];
    const { organisations, error } = await retrieveActiveOrganisations({
      getRetrieveActiveOrganisationsGateway,
      logger
    })();

    expect(organisations).toHaveLength(2);
    expect(organisations).toEqual(expectedResponse);
    expect(error).toBeNull();
  });

  it("errors if there is a problem with the database call", async () => {
    const getRetrieveActiveOrganisationsGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        organisations: null,
        error: "There is an error with the database",
      });
    });

    const { organisations, error } = await retrieveActiveOrganisations({
      getRetrieveActiveOrganisationsGateway,
      logger
    })();

    expect(organisations).toEqual([]);
    expect(error).toEqual("There is an error with the database");
  });
});
