import updateOrganisation from "../../src/usecases/updateOrganisation";
import logger from "../../logger";

describe("updateTrust", () => {
  let updateOrganisationGatewaySpy = jest.fn().mockReturnValue({
    organisation: {
      id: 10,
      name: "Updated Organisation",
    },
    error: null,
  });

  let container;

  beforeEach(() => {
    container = {
      getUpdateOrganisationGateway: () => updateOrganisationGatewaySpy,
      logger
    };
  });

  it("returns an error, if an id isn't present", async () => {
    const { organisation, error } = await updateOrganisation(container)({
      organisationId: "",
      name: "Updated Organisation",
    });

    expect(error).toEqual("An organisationId must be provided.");
    expect(organisation).toBeNull();
  });

  it("returns an error if a name isn't present", async () => {
    const { organisation, error } = await updateOrganisation(container)({
      organisationId: 10,
      name: "",
    });

    expect(error).toEqual("A name must be provided.");
    expect(organisation).toBeNull();
  });

  it("updates a trust in the db when valid", async () => {
    const { organisation, error } = await updateOrganisation(container)({
      organisationId: 10,
      name: "Updated Organisation",
    });

    const expectedResponse = {
      name: "Updated Organisation",
      id: 10,
    };

    expect(organisation).toEqual(expectedResponse);
    expect(updateOrganisationGatewaySpy).toHaveBeenCalledWith({
      id: 10,
      name: "Updated Organisation",
    });
    expect(error).toBeNull();
  });

  it("returns an error if the database query errors", async () => {
    container.getUpdateOrganisationGateway = () =>
      jest.fn().mockReturnValue({ organisation: null, error: "Error: fail" });

    const { organisation, error } = await updateOrganisation(container)({
      organisationId: 10,
      name: "Updated Organisation",
    });

    expect(error).toEqual("Error: fail");
    expect(organisation).toBeNull();
  });
});
