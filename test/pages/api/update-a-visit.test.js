import updateAVisit from "../../../pages/api/update-a-visit";
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
      getUpdateVisitById: () => updateVisitSpy,
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.end).toHaveBeenCalledWith('{"err":"Unauthorized"}');
    expect(userIsAuthenticatedSpy).toHaveBeenCalled();
    expect(updateVisitSpy).not.toHaveBeenCalled();
  });

  it("rejects if id is missing", async () => {
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
      getUpdateVisitById: () => updateVisitSpy,
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      '{"err":{"id":"id must be present"}}'
    );
    expect(updateVisitSpy).not.toHaveBeenCalled();
  });

  it("rejects if phone number is invalid", async () => {
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        id: "1",
        patientName: "Bob Smith",
        contactNumber: "INVALID_NUMBER",
        contactName: "John Smith",
        callTime: moment().toISOString(),
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
      getUpdateVisitById: () => updateVisitSpy,
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
        id: "1",
        patientName: "Bob Smith",
        contactName: "John Smith",
        callTime: moment().toISOString(),
      },
    };

    const response = {
      status: jest.fn(),
      end: jest.fn(),
    };

    const updateVisitSpy = jest.fn();
    const container = {
      getUserIsAuthenticated: () => () => true,
      getUpdateVisitById: () => updateVisitSpy,
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
        id: "1",
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactName: "John Smith",
        callTime: moment().toISOString(),
      },
    };

    const response = {
      status: jest.fn(),
      end: jest.fn(),
    };

    const updateVisitSpy = jest.fn();
    const retrieveVisitByIdSpy = jest.fn().mockResolvedValue({
      scheduledCall: null,
      error: "error",
    });
    const container = {
      getUserIsAuthenticated: () =>
        jest.fn().mockResolvedValue({ wardId: "123" }),
      getUpdateVisitById: () => updateVisitSpy,
      getRetrieveVisitById: () => retrieveVisitByIdSpy,
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.end).toHaveBeenCalledWith('{"err":"call does not exist"}');
    expect(retrieveVisitByIdSpy).toHaveBeenCalledWith({
      id: "1",
      wardId: "123",
    });
    expect(updateVisitSpy).not.toHaveBeenCalled();
  });

  it("returns 500 if there's an exception when updating", async () => {
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        id: "1",
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactName: "John Smith",
        callTime: moment().toISOString(),
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
      getRetrieveVisitById: () => () => callResult,
      getUpdateVisitById: () => () => {
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
        id: "1",
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactName: "John Smith",
        callTime: moment().toISOString(),
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
      getUpdateVisitById: () => updateVisitSpy,
      getRetrieveVisitById: () => () => callResult,
      getRetrieveWardById: () => () => wardResult,
      getSendBookingNotification: () => () => {
        return { success: true, errors: null };
      },
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(updateVisitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "1",
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
        id: "1",
        patientName: "Bob Smith",
        contactEmail: "john.smith@madetech.com",
        contactName: "John Smith",
        callTime: moment().toISOString(),
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
      getUpdateVisitById: () => updateVisitSpy,
      getRetrieveVisitById: () => () => callResult,
      getRetrieveWardById: () => () => wardResult,
      getSendBookingNotification: () => () => {
        return { success: true, errors: null };
      },
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(updateVisitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "1",
        patientName: "Bob Smith",
        recipientEmail: "john.smith@madetech.com",
        recipientName: "John Smith",
      })
    );
  });

  it("does not send a notification if nothing has changed", async () => {
    const callTime = moment();
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        id: "1",
        patientName: "Bob Smith",
        contactEmail: "john.smith@madetech.com",
        contactName: "John Smith",
        callTime: callTime.toISOString(),
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
      getUpdateVisitById: () => updateVisitSpy,
      getRetrieveVisitById: () => () => callResult,
      getRetrieveWardById: () => () => wardResult,
      getSendBookingNotification: () => sendBookingNotificationSpy,
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(updateVisitSpy).toHaveBeenCalled();
    expect(sendBookingNotificationSpy).not.toHaveBeenCalled();
  });

  it("does not send a notification if patient name is changed", async () => {
    const callTime = moment();
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        id: "1",
        patientName: "Bob Smith",
        contactEmail: "john.smith@madetech.com",
        contactName: "John Smith",
        callTime: callTime.toISOString(),
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
      getUpdateVisitById: () => updateVisitSpy,
      getRetrieveVisitById: () => () => callResult,
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
        id: "1",
        patientName: "Bob Smith",
        contactEmail: "john.smith@madetech.com",
        contactName: "John Smith",
        callTime: callTime.toISOString(),
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
      getUpdateVisitById: () => updateVisitSpy,
      getRetrieveVisitById: () => () => callResult,
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
    const newTime = moment().add(1, "h").toISOString();
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        id: "1",
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
      getUpdateVisitById: () => updateVisitSpy,
      getRetrieveVisitById: () => () => callResult,
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
        id: "1",
        patientName: "Bob Smith",
        contactEmail: "Alice.smith@madetech.com",
        contactName: "Alice Smith",
        callTime: callTime.toISOString(),
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
      getUpdateVisitById: () => updateVisitSpy,
      getRetrieveVisitById: () => () => callResult,
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
        visitDateAndTime: callTime.toISOString(),
        notificationType: "new",
      })
    );
  });

  it("sends an new notification if phone number is changed", async () => {
    const callTime = moment();
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        id: "1",
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactName: "John Smith",
        callTime: callTime.toISOString(),
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
      getUpdateVisitById: () => updateVisitSpy,
      getRetrieveVisitById: () => () => callResult,
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
        visitDateAndTime: callTime.toISOString(),
        notificationType: "new",
      })
    );
  });

  it("send an update notification to email address on time change and sends an new notification to phone number if changed", async () => {
    const callTime = moment();
    const newTime = moment().add(1, "h").toISOString();
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        id: "1",
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactName: "John Smith",
        contactEmail: "john.smith@madetech.com",
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
        recipientNumber: "07123456788",
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
      getUpdateVisitById: () => updateVisitSpy,
      getRetrieveVisitById: () => () => callResult,
      getRetrieveWardById: () => () => wardResult,
      getSendBookingNotification: () => sendBookingNotificationSpy,
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(updateVisitSpy).toHaveBeenCalled();
    expect(sendBookingNotificationSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        emailAddress: "john.smith@madetech.com",
        hospitalName: "hospital name",
        wardName: "ward name",
        visitDateAndTime: newTime,
        notificationType: "updated",
      })
    );
    expect(sendBookingNotificationSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        mobileNumber: "07123456789",
        hospitalName: "hospital name",
        wardName: "ward name",
        visitDateAndTime: newTime,
        notificationType: "new",
      })
    );
  });

  it("send a new notification to phone number if added and does not send one to existing email address", async () => {
    const callTime = moment();
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        id: "1",
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactName: "John Smith",
        contactEmail: "john.smith@madetech.com",
        callTime: callTime.toISOString(),
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
      getUpdateVisitById: () => updateVisitSpy,
      getRetrieveVisitById: () => () => callResult,
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
        visitDateAndTime: callTime.toISOString(),
        notificationType: "new",
      })
    );
    expect(sendBookingNotificationSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({
        emailAddress: "john.smith@madetech.com",
        hospitalName: "hospital name",
        wardName: "ward name",
        visitDateAndTime: callTime.toISOString(),
        notificationType: "updated",
      })
    );
  });

  it("send a new notification to email address if added and does not send one to existing phone number", async () => {
    const callTime = moment();
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        id: "1",
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactName: "John Smith",
        contactEmail: "john.smith@madetech.com",
        callTime: callTime.toISOString(),
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
        recipientNumber: "07123456789",
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
      getUpdateVisitById: () => updateVisitSpy,
      getRetrieveVisitById: () => () => callResult,
      getRetrieveWardById: () => () => wardResult,
      getSendBookingNotification: () => sendBookingNotificationSpy,
    };

    await updateAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(updateVisitSpy).toHaveBeenCalled();
    expect(sendBookingNotificationSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        emailAddress: "john.smith@madetech.com",
        hospitalName: "hospital name",
        wardName: "ward name",
        visitDateAndTime: callTime.toISOString(),
        notificationType: "new",
      })
    );
    expect(sendBookingNotificationSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({
        mobileNumber: "07123456789",
        hospitalName: "hospital name",
        wardName: "ward name",
        visitDateAndTime: callTime.toISOString(),
        notificationType: "updated",
      })
    );
  });

  it("returns 500 when sending notification fails", async () => {
    const callTime = moment();
    const request = {
      method: "PATCH",
      headers: { cookie: "test" },
      body: {
        id: "1",
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactName: "John Smith",
        callTime: callTime.toISOString(),
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
      getUpdateVisitById: () => updateVisitSpy,
      getRetrieveVisitById: () => () => callResult,
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
