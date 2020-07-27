import completeVisit from "../../pages/api/complete-visit";

jest.mock("node-fetch");

describe("/api/complete-visit", () => {
  let response = {
    status: jest.fn(),
    setHeader: jest.fn(),
    send: jest.fn(),
    end: jest.fn(),
    body: jest.fn(),
  };

  const validUserIsAuthenticatedSpy = jest.fn().mockResolvedValue({
    wardId: 10,
    ward: "MEOW",
    trustId: 1,
  });

  it("returns 405 if not POST method", async () => {
    await completeVisit({ method: "GET", body: {} }, response, {});

    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns a 401 if user is not authenticated", async () => {
    const invalidUserIsAuthenticatedSpy = jest.fn().mockResolvedValue(false);

    await completeVisit(
      {
        method: "POST",
        body: {},
        headers: {},
      },
      response,
      {
        container: {
          getUserIsAuthenticated: () => invalidUserIsAuthenticatedSpy,
        },
      }
    );

    expect(response.status).toHaveBeenCalledWith(401);
  });

  it("returns a 400 if no callId provided", async () => {
    await completeVisit(
      {
        method: "POST",
        body: {},
      },
      response,
      {
        container: {
          getUserIsAuthenticated: () => validUserIsAuthenticatedSpy,
        },
      }
    );

    expect(response.status).toHaveBeenCalledWith(400);
  });

  it("returns a 401 if invalid callId", async () => {
    await completeVisit(
      {
        method: "POST",
        body: { callId: "123" },
      },
      response,
      {
        container: {
          getRetrieveVisitByCallId: () =>
            jest.fn().mockResolvedValue({
              scheduledCall: null,
              error: "failed to retrieve visit",
            }),
          getUserIsAuthenticated: () => validUserIsAuthenticatedSpy,
        },
      }
    );

    expect(response.status).toHaveBeenCalledWith(401);
  });

  it("returns 500 if mark visit complete failed", async () => {
    await completeVisit(
      {
        method: "POST",
        body: { callId: "123" },
      },
      response,
      {
        container: {
          getUserIsAuthenticated: () => validUserIsAuthenticatedSpy,
          getRetrieveVisitByCallId: () =>
            jest.fn().mockResolvedValue({
              scheduledCall: { id: "456" },
              error: null,
            }),
          getMarkVisitAsComplete: () =>
            jest.fn().mockResolvedValue({ id: null, error: "fail" }),
        },
      }
    );

    expect(response.status).toHaveBeenCalledWith(500);
  });

  it("returns 201 when a visit is marked as complete successfully", async () => {
    const retrieveVisitByCallIdSpy = jest.fn().mockResolvedValue({
      scheduledCall: { id: 456 },
      error: null,
    });

    const markVisitAsCompleteSpy = jest
      .fn()
      .mockResolvedValue({ id: 456, error: null });

    await completeVisit(
      {
        method: "POST",
        body: { callId: "123" },
      },
      response,
      {
        container: {
          getUserIsAuthenticated: () => validUserIsAuthenticatedSpy,
          getRetrieveVisitByCallId: () => retrieveVisitByCallIdSpy,
          getMarkVisitAsComplete: () => markVisitAsCompleteSpy,
        },
      }
    );

    expect(retrieveVisitByCallIdSpy).toHaveBeenCalledWith("123");
    expect(markVisitAsCompleteSpy).toHaveBeenCalledWith({
      id: 456,
      wardId: 10,
    });

    expect(response.status).toHaveBeenCalledWith(201);
  });
});
