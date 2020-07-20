import updateAVisit from "../../pages/api/update-a-visit";
import moment from "moment";

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
        callTime: moment(),
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
        callTime: moment(),
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
        callTime: moment(),
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
        callTime: moment(),
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
        callTime: moment(),
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
        callTime: moment(),
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
        recipientEmail: "john.smith@madetech.com",
        recipientName: "John Smith",
      })
    );
  });

  it("does not send an update notification if nothing has changed", async () => {
    const callTime = moment();
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        callId: "1",
        patientName: "Bob Smith",
        contactEmail: "john.smith@madetech.com",
        contactName: "John Smith",
        callTime: callTime,
      },
    };

    const response = {
      status: jest.fn(),
      end: jest.fn(),
    };

    const userAuthResult = { wardId: 1, trustId: 1 };

    const updateVisitSpy = jest.fn();
    const callResult = {
      scheduledCall: {
        id: "1",
        patientName: "Bob Smith",
        recipientName: "John Smith",
        recipientEmail: "john.smith@madetech.com",
        callId: "1",
        callTime: callTime,
      },
      error: null,
    };

    const wardResult = {
      ward: { name: "ward name", hospitalName: "hospital name" },
      error: null,
    };

    const sendBookingNotificationSpy = jest.fn();
    sendBookingNotificationSpy.mockReturnValue({ success: true, errors: null });

    const container = {
      getUserIsAuthenticated: () => () => userAuthResult,
      getUpdateVisitByCallId: () => updateVisitSpy,
      getRetrieveVisitByCallId: () => () => callResult,
      getRetrieveWardById: () => () => wardResult,
      getSendBookingNotification: () => sendBookingNotificationSpy,
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(updateVisitSpy).toHaveBeenCalled();
    expect(sendBookingNotificationSpy).not.toHaveBeenCalled();
  });

  it("does not send an update notification if patient name is changed", async () => {
    const callTime = moment();
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        callId: "1",
        patientName: "Bob Smith",
        contactEmail: "john.smith@madetech.com",
        contactName: "John Smith",
        callTime: callTime,
      },
    };

    const response = {
      status: jest.fn(),
      end: jest.fn(),
    };

    const userAuthResult = { wardId: 1, trustId: 1 };

    const updateVisitSpy = jest.fn();
    const callResult = {
      scheduledCall: {
        id: "1",
        patientName: "Alice Smith",
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

    const sendBookingNotificationSpy = jest.fn();
    sendBookingNotificationSpy.mockReturnValue({ success: true, errors: null });

    const container = {
      getUserIsAuthenticated: () => () => userAuthResult,
      getUpdateVisitByCallId: () => updateVisitSpy,
      getRetrieveVisitByCallId: () => () => callResult,
      getRetrieveWardById: () => () => wardResult,
      getSendBookingNotification: () => sendBookingNotificationSpy,
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(updateVisitSpy).toHaveBeenCalled();
    expect(sendBookingNotificationSpy).not.toHaveBeenCalledWith();
  });

  it("does not send an update notification if key contact name is changed", async () => {
    const callTime = moment();
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        callId: "1",
        patientName: "Bob Smith",
        contactEmail: "john.smith@madetech.com",
        contactName: "John Smith",
        callTime: callTime,
      },
    };

    const response = {
      status: jest.fn(),
      end: jest.fn(),
    };

    const userAuthResult = { wardId: 1, trustId: 1 };

    const updateVisitSpy = jest.fn();
    const callResult = {
      scheduledCall: {
        id: "1",
        patientName: "Bob Smith",
        recipientName: "Alice Smith",
        recipientEmail: "john.smith@madetech.com",
        callId: "1",
        callTime: callTime,
      },
      error: null,
    };

    const wardResult = {
      ward: { name: "ward name", hospitalName: "hospital name" },
      error: null,
    };

    const sendBookingNotificationSpy = jest.fn();
    sendBookingNotificationSpy.mockReturnValue({ success: true, errors: null });

    const container = {
      getUserIsAuthenticated: () => () => userAuthResult,
      getUpdateVisitByCallId: () => updateVisitSpy,
      getRetrieveVisitByCallId: () => () => callResult,
      getRetrieveWardById: () => () => wardResult,
      getSendBookingNotification: () => sendBookingNotificationSpy,
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(updateVisitSpy).toHaveBeenCalled();
    expect(sendBookingNotificationSpy).not.toHaveBeenCalled();
  });

  it("sends an update notification if date or time is changed", async () => {
    const currentTime = moment();
    const newTime = moment().add(1, "h");
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        callId: "1",
        patientName: "Bob Smith",
        contactEmail: "john.smith@madetech.com",
        contactName: "John Smith",
        callTime: newTime,
      },
    };

    const response = {
      status: jest.fn(),
      end: jest.fn(),
    };

    const userAuthResult = { wardId: 1, trustId: 1 };

    const updateVisitSpy = jest.fn();
    const callResult = {
      scheduledCall: {
        id: "1",
        patientName: "Bob Smith",
        recipientName: "John Smith",
        recipientEmail: "john.smith@madetech.com",
        callTime: currentTime,
        callId: "1",
      },
      error: null,
    };

    const wardResult = {
      ward: { name: "ward name", hospitalName: "hospital name" },
      error: null,
    };

    const sendBookingNotificationSpy = jest.fn();
    sendBookingNotificationSpy.mockReturnValue({ success: true, errors: null });

    const container = {
      getUserIsAuthenticated: () => () => userAuthResult,
      getUpdateVisitByCallId: () => updateVisitSpy,
      getRetrieveVisitByCallId: () => () => callResult,
      getRetrieveWardById: () => () => wardResult,
      getSendBookingNotification: () => sendBookingNotificationSpy,
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(updateVisitSpy).toHaveBeenCalled();
    expect(sendBookingNotificationSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        emailAddress: "john.smith@madetech.com",
        wardName: "ward name",
        hospitalName: "hospital name",
        visitDateAndTime: newTime,
        notificationType: "updated",
      })
    );
  });

  it("sends an new notification if email address is changed", async () => {
    const callTime = moment();
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        callId: "1",
        patientName: "Bob Smith",
        contactEmail: "Alice.smith@madetech.com",
        contactName: "John Smith",
        callTime: callTime,
      },
    };

    const response = {
      status: jest.fn(),
      end: jest.fn(),
    };

    const userAuthResult = { wardId: 1, trustId: 1 };

    const updateVisitSpy = jest.fn();
    const callResult = {
      scheduledCall: {
        id: "1",
        patientName: "Bob Smith",
        recipientName: "Alice Smith",
        recipientEmail: "john.smith@madetech.com",
        callTime: callTime,
        callId: "1",
      },
      error: null,
    };

    const wardResult = {
      ward: { name: "ward name", hospitalName: "hospital name" },
      error: null,
    };

    const sendBookingNotificationSpy = jest.fn();
    sendBookingNotificationSpy.mockReturnValue({ success: true, errors: null });

    const container = {
      getUserIsAuthenticated: () => () => userAuthResult,
      getUpdateVisitByCallId: () => updateVisitSpy,
      getRetrieveVisitByCallId: () => () => callResult,
      getRetrieveWardById: () => () => wardResult,
      getSendBookingNotification: () => sendBookingNotificationSpy,
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(updateVisitSpy).toHaveBeenCalled();
    expect(sendBookingNotificationSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        emailAddress: "Alice.smith@madetech.com",
        wardName: "ward name",
        hospitalName: "hospital name",
        visitDateAndTime: callTime,
        notificationType: "new",
      })
    );
  });

  it("sends an new notification if email address is changed", async () => {
    const callTime = moment();
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        callId: "1",
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactName: "John Smith",
        callTime: callTime,
      },
    };

    const response = {
      status: jest.fn(),
      end: jest.fn(),
    };

    const userAuthResult = { wardId: 1, trustId: 1 };

    const updateVisitSpy = jest.fn();
    const callResult = {
      scheduledCall: {
        id: "1",
        patientName: "Bob Smith",
        recipientName: "John Smith",
        recipientNumber: "07123456788",
        callTime: callTime,
        callId: "1",
      },
      error: null,
    };

    const wardResult = {
      ward: { name: "ward name", hospitalName: "hospital name" },
      error: null,
    };

    const sendBookingNotificationSpy = jest.fn();
    sendBookingNotificationSpy.mockReturnValue({ success: true, errors: null });

    const container = {
      getUserIsAuthenticated: () => () => userAuthResult,
      getUpdateVisitByCallId: () => updateVisitSpy,
      getRetrieveVisitByCallId: () => () => callResult,
      getRetrieveWardById: () => () => wardResult,
      getSendBookingNotification: () => sendBookingNotificationSpy,
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(updateVisitSpy).toHaveBeenCalled();
    expect(sendBookingNotificationSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        mobileNumber: "07123456789",
        hospitalName: "hospital name",
        wardName: "ward name",
        visitDateAndTime: callTime,
        notificationType: "new",
      })
    );
  });

  it("returns 500 when sending notification fails", async () => {
    const callTime = moment();
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        callId: "1",
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactName: "John Smith",
        callTime: callTime,
      },
    };

    const response = {
      status: jest.fn(),
      end: jest.fn(),
    };

    const userAuthResult = { wardId: 1, trustId: 1 };

    const updateVisitSpy = jest.fn();
    const callResult = {
      scheduledCall: {
        id: "1",
        patientName: "Bob Smith",
        recipientName: "John Smith",
        recipientNumber: "07123456788",
        callTime: callTime,
        callId: "1",
      },
      error: null,
    };

    const wardResult = {
      ward: { name: "ward name", hospitalName: "hospital name" },
      error: null,
    };

    const sendBookingNotificationSpy = jest.fn();
    sendBookingNotificationSpy.mockReturnValue({
      success: false,
      errors: { textMessageError: "te", emailError: "ee" },
    });

    const container = {
      getUserIsAuthenticated: () => () => userAuthResult,
      getUpdateVisitByCallId: () => updateVisitSpy,
      getRetrieveVisitByCallId: () => () => callResult,
      getRetrieveWardById: () => () => wardResult,
      getSendBookingNotification: () => sendBookingNotificationSpy,
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.end).toHaveBeenCalledWith(
      '{"err":{"textMessageError":"te","emailError":"ee"}}'
    );
  });
});
