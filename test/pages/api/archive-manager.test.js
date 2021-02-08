import archiveManager from "../../../pages/api/archive-manager";
import { statusToId, DISABLED } from "../../../src/helpers/statusTypes";
describe("archive-manager", () => {
  let validRequest, response, container;
  const expectedUuid = "b6a255bf-ec49-484c-8504-02bdd1ac7dca";

  beforeEach(() => {
    validRequest = {
      method: "DELETE",
      body: {
        uuid: expectedUuid,
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
      getUpdateManagerStatusByUuid: jest.fn().mockReturnValue(() => {
        return { error: null };
      }),
      getOrganisationAdminIsAuthenticated: jest
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
          getOrganisationAdminIsAuthenticated: () =>
            trustAdminIsAuthenticatedSpy,
        },
      }
    );

    expect(response.status).toHaveBeenCalledWith(401);
    expect(trustAdminIsAuthenticatedSpy).toHaveBeenCalled();
  });

  it("archives a manager if valid", async () => {
    const getUpdateManagerStatusByUuidSpy = jest
      .fn()
      .mockReturnValue({ error: null });

    await archiveManager(validRequest, response, {
      container: {
        ...container,
        getUpdateManagerStatusByUuid: () => getUpdateManagerStatusByUuidSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.end).toHaveBeenCalledWith(JSON.stringify({ error: null }));
    expect(getUpdateManagerStatusByUuidSpy).toHaveBeenCalledWith({
      uuid: expectedUuid,
      status: statusToId(DISABLED),
    });
  });

  it("returns a 400 status if errors", async () => {
    const getUpdateManagerStatusByUuidStub = jest
      .fn()
      .mockReturnValue({ error: "Failed to remove manager" });

    await archiveManager(validRequest, response, {
      container: {
        ...container,
        getUpdateManagerStatusByUuid: () => getUpdateManagerStatusByUuidStub,
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
  it("returns a 500 if appContainer call throws an error", async () => {
    // Arrange
    const getUpdateManagerStatusByUuidStub = jest.fn(async () => {
      throw new Error("ERROR!");
    });
    // Act
    await archiveManager(validRequest, response, {
      container: {
        ...container,
        getUpdateManagerStatusByUuid: () => getUpdateManagerStatusByUuidStub,
      },
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "500 (Internal Server Error). Please try again later.",
      })
    );
  });
});
