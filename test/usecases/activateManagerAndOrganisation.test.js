import activateManagerAndOrganisation from "../../src/usecases/activateManagerAndOrganisation";
import logger from "../../logger";

describe("activateManagerAndOrganisation", () => {
  let userId;
  let organisationId;
  let getActivateManagerAndOrganisationGateway;

  beforeEach(() => {
    userId = 1;
    organisationId = 1;
    getActivateManagerAndOrganisationGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        organisation: "test organisation",
        error: null,
      });
    });
  });

  it("returns an error if there is no userId", async () => {
    userId = "";

    const { organisation, error } = await activateManagerAndOrganisation({
      getActivateManagerAndOrganisationGateway,
      logger
    })({ userId, organisationId });

    expect(organisation).toBeNull();
    expect(error).toEqual("userId is not defined");
  });

  it("returns an error if there is no organisationId", async () => {
    organisationId = "";

    const { organisation, error } = await activateManagerAndOrganisation({
      getActivateManagerAndOrganisationGateway,
      logger
    })({ userId, organisationId });

    expect(organisation).toBeNull();
    expect(error).toEqual("organisationId is not defined");
  });

  it("activates an organisation and user and returns an organisation", async () => {
    const getActivateManagerAndOrganisationGatewaySpy = jest
      .fn()
      .mockReturnValue({
        organisation: "test organisation",
        error: null,
      });

    getActivateManagerAndOrganisationGateway = jest.fn(() => {
      return getActivateManagerAndOrganisationGatewaySpy;
    });

    const { organisation, error } = await activateManagerAndOrganisation({
      getActivateManagerAndOrganisationGateway,
      logger
    })({ userId, organisationId });

    const expectedResponse = "test organisation";

    expect(organisation).toEqual(expectedResponse);
    expect(error).toBeNull();
    expect(getActivateManagerAndOrganisationGatewaySpy).toHaveBeenCalledWith({
      userId: 1,
      organisationId: 1,
      verified: true,
      status: 1,
    });
  });

  it("returns an error if there is problem with the database call", async () => {
    getActivateManagerAndOrganisationGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        organisation: null,
        error: "error",
      });
    });

    const { organisation, error } = await activateManagerAndOrganisation({
      getActivateManagerAndOrganisationGateway,
      logger
    })({ userId, organisationId });

    expect(organisation).toBeNull();
    expect(error).toEqual("error");
  });
});
