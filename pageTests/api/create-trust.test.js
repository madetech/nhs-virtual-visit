import createTrust from "../../pages/api/create-trust";

jest.mock("node-fetch");

describe("create-trust", () => {
  let validRequest;
  let response;
  let container;

  beforeEach(() => {
    validRequest = {
      method: "POST",
      body: {
        name: "Test Trust",
        adminCode: "admincode",
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
      getCreateTrust: jest.fn().mockReturnValue(() => {
        return { trustId: 1, error: null };
      }),
      getAdminIsAuthenticated: jest
        .fn()
        .mockReturnValue((cookie) => cookie === "token=valid.token.value"),
    };
  });

  it("returns 405 if not POST method", async () => {
    validRequest.method = "GET";

    await createTrust(validRequest, response, {
      container: container,
    });

    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns a 401 if no token provided", async () => {
    const adminIsAuthenticatedSpy = jest.fn().mockReturnValue(false);

    await createTrust(
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

  it("creates a new trust if valid", async () => {
    const createTrustSpy = jest
      .fn()
      .mockReturnValue({ trustId: 123, error: null });

    await createTrust(validRequest, response, {
      container: {
        ...container,
        getCreateTrust: () => createTrustSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.end).toHaveBeenCalledWith(JSON.stringify({ trustId: 123 }));
    expect(createTrustSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Test Trust",
        adminCode: "admincode",
      })
    );
  });

  it("returns a 409 status if errors", async () => {
    const createTrustStub = jest
      .fn()
      .mockReturnValue({ trustId: null, error: "Error message" });

    await createTrust(validRequest, response, {
      container: {
        ...container,
        getCreateTrust: () => createTrustStub,
      },
    });

    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "Admin code already exists" })
    );
  });

  it("returns a 409 if the name is an empty string", async () => {
    const invalidRequest = {
      method: "POST",
      body: {
        name: "",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await createTrust(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "name must be present" })
    );
  });

  it("returns a 409 if the name is not provided", async () => {
    const invalidRequest = {
      method: "POST",
      body: {},
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await createTrust(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "name must be present" })
    );
  });

  it("returns a 409 if the admin code is not provided", async () => {
    const invalidRequest = {
      method: "POST",
      body: {
        name: "Test Trust",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await createTrust(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "admin code must be present" })
    );
  });

  it("returns a 409 if the admin code is an empty string", async () => {
    const invalidRequest = {
      method: "POST",
      body: {
        name: "Test Trust",
        adminCode: "",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await createTrust(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "admin code must be present" })
    );
  });
});
