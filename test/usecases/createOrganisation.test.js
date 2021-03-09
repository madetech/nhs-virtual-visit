import createOrganisation from "../../src/usecases/createOrganisation";
import logger from "../../logger";

describe("createOrganisation", () => {
  let newOrganisation;
  let getCreateOrganisationGateway;

  beforeEach(() => {
    newOrganisation = {
      name: "Test Trust",
      type: "trust",
      createdBy: 1,
    };

    getCreateOrganisationGateway = jest.fn(() => {
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
  });

  it("returns an error if no name passed in", async () => {
    newOrganisation = {
      ...newOrganisation,
      name: "",
    };

    const { organisationId, error } = await createOrganisation({
      getCreateOrganisationGateway,
      logger
    })(newOrganisation);

    expect(organisationId).toBeNull();
    expect(error).toEqual("name is not defined");
  });

  it("returns an error if no type is passed in", async () => {
    newOrganisation = {
      ...newOrganisation,
      type: "",
    };

    const { organisationId, error } = await createOrganisation({
      getCreateOrganisationGateway,
      logger
    })(newOrganisation);

    expect(organisationId).toBeNull();
    expect(error).toEqual("type is not defined");
  });

  it("creates an new organisation and returns it", async () => {
    const { organisationId, error } = await createOrganisation({
      getCreateOrganisationGateway,
      logger
    })(newOrganisation);

    expect(organisationId).toEqual(1);
    expect(error).toBeNull();
  });

  it("errors if there is a problem with the database call", async () => {
    getCreateOrganisationGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        organisation: null,
        error: "There is an error with the database",
      });
    });

    const { organisationId, error } = await createOrganisation({
      getCreateOrganisationGateway,
      logger
    })(newOrganisation);

    expect(organisationId).toBeFalsy();
    expect(error).toEqual("There is an error with the database");
  });
});
