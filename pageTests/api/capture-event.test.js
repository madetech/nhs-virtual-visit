import captureEvent from "../../pages/api/capture-event";

jest.mock("node-fetch");

describe("/api/capture-event", () => {
  let request;
  let response;
  let container;

  const validUserIsAuthenticatedSpy = jest.fn().mockResolvedValue({
    wardId: 10,
    ward: "MEOW",
    trustId: 1,
  });

  const verifyCallPassword = jest.fn((callId, password) => ({
    validCallPassword: password === "securePassword" && callId === "123",
    error: null,
  }));

  const mockCaptureEvent = jest.fn().mockReturnValue(() => ({
    event: {
      id: 1,
      time: "2020-06-01-12:00:00Z",
      action: "join-visit",
      visitId: 1,
      callSessionId: "75011638-baab-4f68-af52-c6a85e8c8081",
    },
    error: null,
  }));

  beforeEach(() => {
    request = {
      method: "POST",
      body: {
        action: "join-visit",
        visitId: "1",
        callSessionId: "1023ea12-670c-40e1-bc90-33b4d490a048",
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
      getUserIsAuthenticated: () => validUserIsAuthenticatedSpy,
      getCaptureEvent: mockCaptureEvent,
      getVerifyCallPassword: () => verifyCallPassword,
    };
  });

  it("returns 405 if not POST method", async () => {
    request.method = "GET";

    await captureEvent(request, response, {
      container: container,
    });

    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns a 401 if no token provided", async () => {
    const userIsAuthenticatedMock = jest.fn().mockResolvedValue(false);

    await captureEvent(
      {
        method: "POST",
        body: {},
        headers: {},
      },
      response,
      {
        container: {
          ...container,
          getUserIsAuthenticated: () => userIsAuthenticatedMock,
        },
      }
    );

    expect(response.status).toHaveBeenCalledWith(401);
  });

  it("returns a 401 if no callId provided", async () => {
    const userIsAuthenticated = jest.fn().mockResolvedValue(false);

    await captureEvent(
      {
        method: "POST",
        body: { callPassword: "securePassword" },
      },
      response,
      {
        container: {
          ...container,
          getUserIsAuthenticated: () => userIsAuthenticated,
        },
      }
    );

    expect(response.status).toHaveBeenCalledWith(401);
  });

  it("returns a 401 if no callPassword provided", async () => {
    const userIsAuthenticated = jest.fn().mockResolvedValue(false);

    await captureEvent(
      {
        method: "POST",
        body: { callId: "123" },
      },
      response,
      {
        container: {
          ...container,
          getUserIsAuthenticated: () => userIsAuthenticated,
        },
      }
    );

    expect(response.status).toHaveBeenCalledWith(401);
  });

  it("returns a 401 if invalid call password", async () => {
    const userIsAuthenticated = jest.fn().mockResolvedValue(false);

    await captureEvent(
      {
        method: "POST",
        body: { callId: "123", callPassword: "fakeCode" },
      },
      response,
      {
        container: {
          ...container,
          getUserIsAuthenticated: () => userIsAuthenticated,
        },
      }
    );

    expect(verifyCallPassword).toHaveBeenCalledWith("123", "fakeCode");
    expect(response.status).toHaveBeenCalledWith(401);
  });

  it("returns 400 if action missing", async () => {
    const badRequest = {
      ...request,
      body: {
        visitId: "1",
        callSessionId: "1023ea12-670c-40e1-bc90-33b4d490a048",
      },
    };

    await captureEvent(badRequest, response, { container: container });

    expect(response.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 if action not valid", async () => {
    const badRequest = {
      ...request,
      body: {
        action: "frewge",
        visitId: "1",
        callSessionId: "1023ea12-670c-40e1-bc90-33b4d490a048",
      },
    };

    await captureEvent(badRequest, response, { container: container });

    expect(response.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 if visitId missing", async () => {
    const badRequest = {
      ...request,
      body: {
        action: "join-visit",
        callSessionId: "1023ea12-670c-40e1-bc90-33b4d490a048",
      },
    };

    await captureEvent(badRequest, response, { container: container });

    expect(response.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 if visitId not valid", async () => {
    const badRequest = {
      ...request,
      body: {
        action: "join-visit",
        visitId: "ijoij",
        callSessionId: "1023ea12-670c-40e1-bc90-33b4d490a048",
      },
    };

    await captureEvent(badRequest, response, { container: container });

    expect(response.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 if callSessionId missing", async () => {
    const badRequest = {
      ...request,
      body: {
        action: "join-visit",
        visitId: "1",
      },
    };

    await captureEvent(badRequest, response, { container: container });

    expect(response.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 if callSessionId not valid", async () => {
    const badRequest = {
      ...request,
      body: {
        action: "join-visit",
        visitId: "1",
        callSessionId: "ceew",
      },
    };

    await captureEvent(badRequest, response, { container: container });

    expect(response.status).toHaveBeenCalledWith(400);
  });

  it("returns 500 if event capture failed", async () => {
    const mockFailingCaptureEvent = jest.fn(() => ({
      event: null,
      error: "Failed",
    }));

    await captureEvent(request, response, {
      container: {
        ...container,
        getCaptureEvent: () => mockFailingCaptureEvent,
      },
    });

    expect(response.status).toHaveBeenCalledWith(500);
  });

  it("returns 201 for a valid event with authentication cookie", async () => {
    await captureEvent(request, response, { container: container });

    expect(response.status).toHaveBeenCalledWith(201);
  });

  it("returns 201 for a valid event with callId and callPassword", async () => {
    await captureEvent(
      {
        method: "POST",
        body: {
          callId: "123",
          callPassword: "securePassword",
          action: "join-visit",
          visitId: "1",
          callSessionId: "1023ea12-670c-40e1-bc90-33b4d490a048",
        },
      },
      response,
      { container: container }
    );

    expect(response.status).toHaveBeenCalledWith(201);
  });
});
