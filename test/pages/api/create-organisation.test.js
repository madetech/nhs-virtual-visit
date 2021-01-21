import createOrganisation from "../../../pages/api/create-organisation";

describe("send-reset-password-email", () => {
  let validRequest, response, container;

  beforeEach(() => {
    validRequest = {
      method: "POST",
      body: {
        name: "New Trust",
        type: "trust",
        userId: 1,
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };
    response = {
      status: jest.fn(),
      setHeader: jest.fn(),
      send: jest.fn(),
      end: jest.fn(),
      body: jest.fn(),
    };
    container = {
      getAdminIsAuthenticated: jest
        .fn()
        .mockReturnValue((cookie) => cookie === "token=valid.token.value"),
      getCreateOrganisation: jest.fn().mockReturnValue(() => {
        return {
          organisationId: 1,
          error: null,
        };
      }),
    };
  });

  it("returns 405 if not POST method", async () => {
    validRequest.method = "GET";

    await createOrganisation(validRequest, response, {
      container: container,
    });

    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns a 401 if no token provided", async () => {
    const adminIsAuthenticatedSpy = jest.fn().mockReturnValue(false);

    await createOrganisation(
      {
        method: "POST",
        body: {},
        headers: {},
      },
      response,
      {
        container: {
          ...container,
          getAdminIsAuthenticated: () => adminIsAuthenticatedSpy,
        },
      }
    );

    expect(response.status).toHaveBeenCalledWith(401);
    expect(adminIsAuthenticatedSpy).toHaveBeenCalled();
  });

  it("returns a 400 if the organisation name is not present", async () => {
    const invalidRequest = {
      method: "POST",
      body: {
        name: "",
        type: "trust",
        userId: 1,
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await createOrganisation(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "trust name must be present" })
    );
  });

  it("returns a 201 if the sendEmail is successful", async () => {
    const createOrganisationSpy = jest.fn().mockReturnValue({
      organisationId: 1,
      error: null,
    });

    await createOrganisation(validRequest, response, {
      container: {
        ...container,
        getCreateOrganisation: () => createOrganisationSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ organisationId: 1 })
    );
    expect(createOrganisationSpy).toHaveBeenCalledWith({
      name: "New Trust",
      type: "trust",
      createdBy: 1,
    });
  });

  it("returns a 400 if there is an error returned from createOrganisation database call", async () => {
    const createOrganisationStub = jest.fn().mockReturnValue({
      id: null,
      error: "There was an error",
    });

    await createOrganisation(validRequest, response, {
      container: {
        ...container,
        getCreateOrganisation: () => createOrganisationStub,
      },
    });

    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "There was an error creating a new trust" })
    );
  });
});
