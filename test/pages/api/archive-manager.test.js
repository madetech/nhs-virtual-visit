import archiveManager from "../../../pages/api/archive-manager";

describe("archive-manager", () => {
  let validRequest, response, container;

  beforeEach(() => {
    validRequest = {
      method: "DELETE",
      body: {
        uuid: "b6a255bf-ec49-484c-8504-02bdd1ac7dca",
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
      getArchiveManagerByUuid: jest.fn().mockReturnValue(() => {
        return { error: null };
      }),
      getTrustAdminIsAuthenticated: jest
        .fn()
        .mockReturnValue(
          (cookie) => cookie === "token=valid.token.value" && { trustId: "1" }
        ),
    };
  });

  it("returns 405 if not DELETE method", async () => {
    validRequest.method = "GET";

    await archiveManager(validRequest, response, {
      container: container,
    });

    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns a 401 if not a trust admin", async () => {
    const trustAdminIsAuthenticatedSpy = jest.fn().mockReturnValue(false);

    await archiveManager(
      {
        method: "DELETE",
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

  it("archives a manager if valid", async () => {
    const archiveManagerByUuidSpy = jest.fn().mockReturnValue({ error: null });

    await archiveManager(validRequest, response, {
      container: {
        ...container,
        getArchiveManagerByUuid: () => archiveManagerByUuidSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.end).toHaveBeenCalledWith(JSON.stringify({ error: null }));
    expect(archiveManagerByUuidSpy).toHaveBeenCalledWith(
      "b6a255bf-ec49-484c-8504-02bdd1ac7dca"
    );
  });

  it("returns a 400 status if errors", async () => {
    const archiveManagerByUuidStub = jest
      .fn()
      .mockReturnValue({ error: "Failed to remove manager" });

    await archiveManager(validRequest, response, {
      container: {
        ...container,
        getArchiveManagerByUuid: () => archiveManagerByUuidStub,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
  });

  it("returns a 400 if the uuid id is an empty string", async () => {
    const invalidRequest = {
      method: "DELETE",
      body: {
        uuid: "",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await archiveManager(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "Manager uuid must be present" })
    );
  });
});
