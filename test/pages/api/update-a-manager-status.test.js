import updateAManagerStatus from "../../../pages/api/update-a-manager-status";

describe("update-a-manager-status", () => {
  let validRequest, response, container;
  const expectedUuid = "b6a255bf-ec49-484c-8504-02bdd1ac7dca";
  const expectedStatus = "active";

  beforeEach(() => {
    validRequest = {
      method: "PATCH",
      body: {
        uuid: expectedUuid,
        status: expectedStatus,
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
      getUpdateManagerByUuid: jest.fn().mockReturnValue(() => {
        return { uuid: expectedUuid, error: null };
      }),
      getTrustAdminIsAuthenticated: jest
        .fn()
        .mockReturnValue((cookie) =>
          cookie === "token=valid.token.value" ? { trustId: 1 } : false
        ),
      getRetrieveManagerByUuid: jest.fn().mockReturnValue(() => {
        return { error: null };
      }),
      getTokenProvider: jest
        .fn()
        .mockReturnValue({ type: "trustAdmin", trustId: 1 }),
    };
  });

  it("returns 405 if not PATCH method", async () => {
    validRequest.method = "GET";

    await updateAManagerStatus(validRequest, response, {
      container: container,
    });

    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns a 401 if no token provided", async () => {
    const trustAdminIsAuthenticatedSpy = jest.fn().mockReturnValue(false);

    await updateAManagerStatus(
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

  it("returns a 400 status if body is not provided", async () => {
    await updateAManagerStatus(
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
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "Manager uuid and status must be present" })
    );
  });

  it("returns a 400 if uuid is not provided", async () => {
    const invalidRequest = {
      method: "PATCH",
      body: {
        status: expectedStatus,
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await updateAManagerStatus(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "Manager uuid and status must be present" })
    );
  });

  it("returns a 400 if status is not provided", async () => {
    const invalidRequest = {
      method: "PATCH",
      body: {
        uuid: expectedUuid,
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await updateAManagerStatus(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "Manager uuid and status must be present" })
    );
  });

  it("returns a 400 if uuid is an empty string", async () => {
    const invalidRequest = {
      method: "PATCH",
      body: {
        id: "",
        status: expectedStatus,
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await updateAManagerStatus(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "Manager uuid and status must be present" })
    );
  });

  it("returns a 400 if status is an empty string", async () => {
    const invalidRequest = {
      method: "PATCH",
      body: {
        uuid: expectedUuid,
        status: "",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await updateAManagerStatus(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "Manager uuid and status must be present" })
    );
  });

  it("returns a 404 if manager does not exist", async () => {
    const retrieveManagerByUuidSpy = jest
      .fn()
      .mockReturnValue({ error: "Error!" });

    await updateAManagerStatus(validRequest, response, {
      container: {
        ...container,
        getRetrieveManagerByUuid: () => retrieveManagerByUuidSpy,
      },
    });

    expect(retrieveManagerByUuidSpy).toHaveBeenCalledWith(expectedUuid);
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "Manager does not exist in current organisation",
      })
    );
  });

  it("returns a 500 if manager fails to update", async () => {
    const updateManagerSpy = jest.fn().mockReturnValue(() => {
      return { error: "Error!" };
    });

    container.getUpdateManagerByUuid = updateManagerSpy;

    await updateAManagerStatus(validRequest, response, { container });
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "Error!" })
    );
  });
});
