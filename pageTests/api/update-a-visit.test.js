import updateAVisit from "../../pages/api/update-a-visit";

describe("/api/book-a-visit", () => {
  it("returns a 405 when incorrect method is used", async () => {
    const request = {
      method: "POST",
    };

    const response = {
      status: jest.fn(),
      end: jest.fn(),
    };

    const container = {};

    await updateAVisit(request, response, { container });
    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns a 401 when there is no token provided", async () => {
    const request = {
      method: "PATCH",
      headers: {},
    };

    const response = {
      status: jest.fn(),
      end: jest.fn(),
    };

    const updateVisitSpy = jest.fn();
    const userIsAuthenticatedSpy = jest.fn().mockResolvedValue(false);
    const container = {
      getUserIsAuthenticated: () => userIsAuthenticatedSpy,
      getUpdateVisitByCallId: () => updateVisitSpy,
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.end).toHaveBeenCalledWith('{"err":"Unauthorized"}');
    expect(userIsAuthenticatedSpy).toHaveBeenCalled();
    expect(updateVisitSpy).not.toHaveBeenCalled();
  });

  it("rejects if callId is missing", async () => {
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {},
    };

    const response = {
      status: jest.fn(),
      end: jest.fn(),
    };

    const updateVisitSpy = jest.fn();
    const container = {
      getUserIsAuthenticated: () => () => true,
      getUpdateVisitByCallId: () => updateVisitSpy,
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      '{"err":{"callId":"callId must be present"}}'
    );
    expect(updateVisitSpy).not.toHaveBeenCalled();
  });

  it("rejects if phone number is invalid", async () => {
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        callId: "1",
        patientName: "Bob Smith",
        contactNumber: "INVALID_NUMBER",
        contactName: "John Smith",
        callTime: new Date(),
      },
    };

    const response = {
      status: jest.fn(),
      end: jest.fn(),
    };

    const updateVisitSpy = jest.fn();
    const container = {
      getUserIsAuthenticated: () => () => true,
      getValidateMobileNumber: () => () => false,
      getUpdateVisitByCallId: () => updateVisitSpy,
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      '{"err":{"contactNumber":"contactNumber must be a valid mobile number"}}'
    );
    expect(updateVisitSpy).not.toHaveBeenCalled();
  });

  it("rejects if neither email nor phone number are present", async () => {
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        callId: "1",
        patientName: "Bob Smith",
        contactName: "John Smith",
        callTime: new Date(),
      },
    };

    const response = {
      status: jest.fn(),
      end: jest.fn(),
    };

    const updateVisitSpy = jest.fn();
    const container = {
      getUserIsAuthenticated: () => () => true,
      getUpdateVisitByCallId: () => updateVisitSpy,
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      '{"err":{"contactEmail":"contactNumber or contactEmail must be present","contactNumber":"contactNumber or contactEmail must be present"}}'
    );
    expect(updateVisitSpy).not.toHaveBeenCalled();
  });

  it("returns 404 if call doesn't exist", async () => {
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        callId: "1",
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactName: "John Smith",
        callTime: new Date(),
      },
    };

    const response = {
      status: jest.fn(),
      end: jest.fn(),
    };

    const updateVisitSpy = jest.fn();
    const callNotFoundResult = {
      scheduledCall: null,
      error: "error",
    };
    const container = {
      getUserIsAuthenticated: () => () => true,
      getUpdateVisitByCallId: () => updateVisitSpy,
      getRetrieveVisitByCallId: () => () => callNotFoundResult,
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.end).toHaveBeenCalledWith('{"err":"call does not exist"}');
    expect(updateVisitSpy).not.toHaveBeenCalled();
  });

  it("returns 500 if there's an exception when updating", async () => {
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        callId: "1",
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactName: "John Smith",
        callTime: new Date(),
      },
    };

    const response = {
      status: jest.fn(),
      end: jest.fn(),
    };

    const callResult = {
      scheduledCall: {
        id: "1",
        patientName: "Bob Smith",
        recipientName: "John Smith",
        recipientNumber: "07123456789",
        callId: "1",
      },
      error: null,
    };

    const container = {
      getUserIsAuthenticated: () => () => true,
      getRetrieveVisitByCallId: () => () => callResult,
      getUpdateVisitByCallId: () => () => {
        throw new Error();
      },
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.end).toHaveBeenCalledWith(
      '{"err":"Failed to update visit"}'
    );
  });

  it("updates a visit if valid with a mobile number", async () => {
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        callId: "1",
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactName: "John Smith",
        callTime: new Date(),
      },
    };

    const response = {
      status: jest.fn(),
      end: jest.fn(),
    };

    const updateVisitSpy = jest.fn();
    const callResult = {
      scheduledCall: {
        id: "1",
        patientName: "Bob Smith",
        recipientName: "John Smith",
        recipientNumber: "07123456789",
        callId: "1",
      },
      error: null,
    };

    const wardResult = {
      ward: { name: "ward name", hospitalName: "hospital name" },
      error: null,
    };
    const container = {
      getUserIsAuthenticated: () => () => true,
      getUpdateVisitByCallId: () => updateVisitSpy,
      getRetrieveVisitByCallId: () => () => callResult,
      getRetrieveWardById: () => () => wardResult,
      getSendBookingNotification: () => () => {
        return { success: true, errors: null };
      },
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(updateVisitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        callId: "1",
        patientName: "Bob Smith",
        recipientNumber: "07123456789",
        recipientName: "John Smith",
      })
    );
  });

  it("updates a visit if valid with an email address", async () => {
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        callId: "1",
        patientName: "Bob Smith",
        contactEmail: "john.smith@madetech.com",
        contactName: "John Smith",
        callTime: new Date(),
      },
    };

    const response = {
      status: jest.fn(),
      end: jest.fn(),
    };

    const updateVisitSpy = jest.fn();
    const callResult = {
      scheduledCall: {
        id: "1",
        patientName: "Bob Smith",
        recipientName: "John Smith",
        recipientEmail: "john.smith@madetech.com",
        callId: "1",
      },
      error: null,
    };

    const wardResult = {
      ward: { name: "ward name", hospitalName: "hospital name" },
      error: null,
    };
    const container = {
      getUserIsAuthenticated: () => () => true,
      getUpdateVisitByCallId: () => updateVisitSpy,
      getRetrieveVisitByCallId: () => () => callResult,
      getRetrieveWardById: () => () => wardResult,
      getSendBookingNotification: () => () => {
        return { success: true, errors: null };
      },
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(updateVisitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        callId: "1",
        patientName: "Bob Smith",
        contactEmail: "john.smith@madetech.com",
        contactName: "John Smith",
      })
    );
  });
});
