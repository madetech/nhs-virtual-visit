import updateATrust from "../../../pages/api/update-a-trust";

describe("/api/update-a-trust", () => {
  it("returns a 200 if the method is PATCH", async () => {
    const response = {
      status: jest.fn().mockReturnValue({ end: jest.fn() }),
    };

    const req = {
      headers: { cookie: "token" },
      body: {
        id: 5,
        videoProvider: "whereby",
      },
      method: "PATCH",
    };

    const container = {
      getAdminIsAuthenticated: () => jest.fn().mockReturnValue(true),
      getUpdateTrust: () => jest.fn().mockResolvedValue({ id: 5, error: null }),
    };

    await updateATrust(req, response, { container });

    expect(response.status).toBeCalledWith(200);
  });

  it("returns a 405 if the action is not PATCH", () => {
    const response = {
      status: jest.fn().mockReturnValue({ end: jest.fn() }),
    };
    const req = { body: {}, method: "GET" };

    updateATrust(req, response);

    expect(response.status).toBeCalledWith(405);
  });

  it("returns a 400 if the id is not present", () => {
    const response = {
      status: jest.fn().mockReturnValue({ end: jest.fn() }),
    };

    const body = {
      videoProvider: "whereby",
    };

    const container = {
      getAdminIsAuthenticated: () => jest.fn().mockReturnValue(true),
    };

    const req = { headers: { cookie: "token" }, body, method: "PATCH" };

    updateATrust(req, response, { container });

    expect(response.status).toBeCalledWith(400);
  });

  it("returns a 400 if the id is invalid", () => {
    const response = {
      status: jest.fn().mockReturnValue({ end: jest.fn() }),
    };

    const body = {
      id: "hello",
      videoProvider: "whereby",
    };

    const container = {
      getAdminIsAuthenticated: () => jest.fn().mockReturnValue(true),
    };

    const req = { headers: { cookie: "token" }, body, method: "PATCH" };

    updateATrust(req, response, { container });

    expect(response.status).toBeCalledWith(400);
  });

  it("returns a 400 if the videoProvider is not present", () => {
    const response = {
      status: jest.fn().mockReturnValue({ end: jest.fn() }),
    };

    const body = {
      id: 5,
    };

    const container = {
      getAdminIsAuthenticated: () => jest.fn().mockReturnValue(true),
    };

    const req = { headers: { cookie: "token" }, body, method: "PATCH" };

    updateATrust(req, response, { container });

    expect(response.status).toBeCalledWith(400);
  });

  it("returns a 400 if the videoProvider is invalid", () => {
    const response = {
      status: jest.fn().mockReturnValue({ end: jest.fn() }),
    };

    const body = {
      id: 5,
      videoProvider: "hello",
    };

    const container = {
      getAdminIsAuthenticated: () => jest.fn().mockReturnValue(true),
    };

    const req = { headers: { cookie: "token" }, body, method: "PATCH" };

    updateATrust(req, response, { container });

    expect(response.status).toBeCalledWith(400);
  });

  it("returns a 401 if user is not an admin", () => {
    const response = {
      status: jest.fn().mockReturnValue({ end: jest.fn() }),
    };

    const body = {
      id: 5,
      videoProvider: "whereby",
    };

    const adminIsAuthenticatedStub = jest.fn().mockReturnValue(false);
    const container = {
      getAdminIsAuthenticated: () => adminIsAuthenticatedStub,
    };

    const req = { headers: { cookie: "token" }, body, method: "PATCH" };

    updateATrust(req, response, { container });

    expect(response.status).toBeCalledWith(401);
    expect(adminIsAuthenticatedStub).toBeCalledWith("token");
  });

  it("updates a trust", async () => {
    const response = {
      status: jest.fn().mockReturnValue({ end: jest.fn() }),
    };

    const body = {
      id: 5,
      videoProvider: "whereby",
    };

    const updateTrustStub = jest.fn().mockResolvedValue({ id: 5, error: null });

    const container = {
      getAdminIsAuthenticated: () => jest.fn().mockReturnValue(true),
      getUpdateTrust: () => updateTrustStub,
    };

    const req = { headers: { cookie: "token" }, body, method: "PATCH" };

    await updateATrust(req, response, { container });

    expect(response.status).toBeCalledWith(200);
    expect(updateTrustStub).toHaveBeenCalledWith({
      id: 5,
      videoProvider: "whereby",
    });
  });

  it("returns a 404 if trust doesn't exist", async () => {
    const response = {
      status: jest.fn().mockReturnValue({ end: jest.fn() }),
    };

    const body = {
      id: 12345,
      videoProvider: "whereby",
    };

    const updateTrustStub = jest
      .fn()
      .mockResolvedValue({ id: null, error: null });

    const container = {
      getAdminIsAuthenticated: () => jest.fn().mockReturnValue(true),
      getUpdateTrust: () => updateTrustStub,
    };

    const req = { headers: { cookie: "token" }, body, method: "PATCH" };

    await updateATrust(req, response, { container });

    expect(response.status).toBeCalledWith(404);
  });
});
