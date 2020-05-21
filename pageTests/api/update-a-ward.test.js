import updateAWard from "../../pages/api/update-a-ward";

jest.mock("node-fetch");

describe("update-a-ward", () => {
  let validRequest;
  let response;
  let container;

  beforeEach(() => {
    validRequest = {
      method: "PATCH",
      body: {
        id: 123,
        name: "Joey Wheeler Ward",
        hospitalName: "Tristan Taylor Hospital",
        hospitalId: 1,
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };
    response = {
      status: jest.fn(),
      setHeader: jest.fn(),
      end: jest.fn(),
      body: jest.fn(),
    };
    container = {
      getUpdateWard: jest.fn().mockReturnValue(() => {
        return { wardId: 123, error: null };
      }),
      getTrustAdminIsAuthenticated: jest
        .fn()
        .mockReturnValue((cookie) => cookie === "token=valid.token.value"),
      getRetrieveWardById: jest.fn().mockReturnValue(() => {
        return { error: null };
      }),
      getTokenProvider: jest
        .fn()
        .mockReturnValue({ type: "trustAdmin", trustId: 1 }),
    };
  });

  it("returns 405 if not PATCH method", async () => {
    validRequest.method = "GET";

    await updateAWard(validRequest, response, {
      container: container,
    });

    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns a 401 if no token provided", async () => {
    const trustAdminIsAuthenticatedSpy = jest.fn().mockReturnValue(false);

    await updateAWard(
      {
        method: "PATCH",
        body: {},
        headers: {},
      },
      response,
      {
        container: {
          ...container,
          getTrustAdminIsAuthenticated: () => trustAdminIsAuthenticatedSpy,
        },
      }
    );

    expect(response.status).toHaveBeenCalledWith(401);
    expect(trustAdminIsAuthenticatedSpy).toHaveBeenCalled();
  });

  it("updates a ward if valid", async () => {
    const updateWardSpy = jest
      .fn()
      .mockReturnValue({ wardId: 123, error: null });

    await updateAWard(validRequest, response, {
      container: {
        ...container,
        getUpdateWard: () => updateWardSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.end).toHaveBeenCalledWith(JSON.stringify({ wardId: 123 }));
    expect(updateWardSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 123,
        name: "Joey Wheeler Ward",
        hospitalName: "Tristan Taylor Hospital",
        hospitalId: 1,
      })
    );
  });

  it("returns a 400 status if errors", async () => {
    const updateWardStub = jest
      .fn()
      .mockReturnValue({ wardId: 123, error: "Error message" });

    await updateAWard(validRequest, response, {
      container: {
        ...container,
        getUpdateWard: () => updateWardStub,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
  });

  it("returns a 400 status if body is not provided", async () => {
    await updateAWard(
      {
        method: "PATCH",
        headers: {
          cookie: "token=valid.token.value",
        },
      },
      response,
      {
        container: {
          ...container,
        },
      }
    );

    expect(response.status).toHaveBeenCalledWith(400);
  });

  it("returns a 400 if id is not provided", async () => {
    const invalidRequest = {
      method: "PATCH",
      body: {
        name: "Joey Wheeler Ward",
        hospitalName: "Tristan Taylor Hospital",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await updateAWard(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "id must be present" })
    );
  });

  it("returns a 400 if id is an empty string", async () => {
    const invalidRequest = {
      method: "PATCH",
      body: {
        id: "",
        name: "Joey Wheeler Ward",
        hospitalName: "Tristan Taylor Hospital",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await updateAWard(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "id must be present" })
    );
  });

  it("returns a 400 if name is not provided", async () => {
    const invalidRequest = {
      method: "PATCH",
      body: {
        id: 123,
        hospitalName: "Tristan Taylor Hospital",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await updateAWard(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "name must be present" })
    );
  });

  it("returns a 400 if name is an empty string", async () => {
    const invalidRequest = {
      method: "PATCH",
      body: {
        id: 123,
        name: "",
        hospitalName: "Tristan Taylor Hospital",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await updateAWard(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "name must be present" })
    );
  });

  it("returns a 400 if hospital id is not provided", async () => {
    const invalidRequest = {
      method: "PATCH",
      body: {
        id: 123,
        name: "Joey Wheeler Ward",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await updateAWard(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "hospital id must be present" })
    );
  });

  it("returns a 400 if ward does not exist in current trust", async () => {
    await updateAWard(validRequest, response, {
      container: {
        ...container,
        getRetrieveWardById: jest.fn().mockReturnValue(() => {
          return { error: "Error!" };
        }),
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "ward does not exist in current trust" })
    );
  });

  it("returns a 400 if a hospital id is not present", async () => {
    const invalidRequest = {
      method: "PATCH",
      body: {
        id: 123,
        name: "Joey Wheeler Ward",
        hospitalName: "TestHospital",
        hospitalId: "",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };
    await updateAWard(invalidRequest, response, {
      container: {
        ...container,
        getRetrieveWardById: jest.fn().mockReturnValue(() => {
          return { error: "Error!" };
        }),
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "hospital id must be present" })
    );
  });
});
