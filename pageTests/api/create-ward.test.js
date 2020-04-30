import createWard from "../../pages/api/create-ward";
import fetch from "node-fetch";

jest.mock("node-fetch");

describe("create-ward", () => {
  let validRequest;
  let response;
  let container;

  beforeEach(() => {
    validRequest = {
      method: "POST",
      body: {
        name: "Seto Kaiba Ward",
        hospitalName: "Yugi Muto Hospital",
        code: "YamiYugi",
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
      getCreateWard: jest.fn().mockReturnValue(() => {
        return { wardId: 1, error: null };
      }),
      getAdminIsAuthenticated: jest
        .fn()
        .mockReturnValue((cookie) => cookie === "token=valid.token.value"),
    };
  });

  it("returns 405 if not POST method", async () => {
    validRequest.method = "GET";

    await createWard(validRequest, response, {
      container: container,
    });

    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns a 401 if no token provided", async () => {
    const adminIsAuthenticatedSpy = jest.fn().mockReturnValue(false);

    await createWard(
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

  it("creates a new ward if valid", async () => {
    const createWardSpy = jest
      .fn()
      .mockReturnValue({ wardId: 123, error: null });

    await createWard(validRequest, response, {
      container: {
        ...container,
        getCreateWard: () => createWardSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(201);
    expect(createWardSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Seto Kaiba Ward",
        hospitalName: "Yugi Muto Hospital",
        code: "YamiYugi",
      })
    );
  });

  it("returns a 400 status if errors", async () => {
    const createWardStub = jest
      .fn()
      .mockReturnValue({ wardId: 123, error: "Error message" });

    await createWard(validRequest, response, {
      container: {
        ...container,
        getCreateWard: () => createWardStub,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
  });

  it("returns a 400 if the name is an empty string", async () => {
    const invalidRequest = {
      method: "POST",
      body: {
        name: "",
        hospitalName: "Yugi Muto Hospital",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await createWard(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "name must be present" })
    );
  });

  it("returns a 400 if the name is not provided", async () => {
    const invalidRequest = {
      method: "POST",
      body: {
        hospitalName: "Yugi Muto Hospital",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await createWard(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "name must be present" })
    );
  });

  it("returns a 400 if the hospital name is an empty string", async () => {
    const invalidRequest = {
      method: "POST",
      body: {
        name: "Seto Kaiba Ward",
        hospitalName: "",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await createWard(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "hospital name must be present" })
    );
  });

  it("returns a 400 if the hospital name is not provided", async () => {
    const invalidRequest = {
      method: "POST",
      body: {
        name: "Seto Kaiba Ward",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await createWard(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "hospital name must be present" })
    );
  });
});
