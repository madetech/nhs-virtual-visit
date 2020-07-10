import bookAVisit from "../../pages/api/book-a-visit";
import fetch from "node-fetch";
import moment from "moment";

jest.mock("node-fetch");

const frozenTime = moment();

describe("/api/book-a-visit", () => {
  let request;
  let response;
  let container;
  let createVisitSpy;

  const validUserIsAuthenticatedSpy = jest.fn().mockResolvedValue({
    wardId: 10,
    ward: "MEOW",
    trustId: 1,
  });

  const updateWardVisitTotalsSpy = jest.fn(() => ({
    success: true,
  }));

  const getRetrieveWardByIdSpy = jest.fn(() => ({
    ward: {
      id: 10,
      name: "Fake Ward",
      hospitalName: "Fake Hospital",
      code: "MEOW",
    },
    error: null,
  }));

  const getRetrieveWherebyTrustByIdSpy = jest.fn().mockResolvedValue({
    trust: {
      id: 1,
      name: "Test trust",
      videoProvider: "whereby",
    },
    error: null,
  });

  const getRetrieveJitsiTrustByIdSpy = jest.fn().mockResolvedValue({
    trust: {
      id: 1,
      name: "Test trust",
      videoProvider: "jitsi",
    },
    error: null,
  });

  const sendBookingNotificationSpy = jest.fn().mockResolvedValue({
    success: true,
    errors: null,
  });

  beforeEach(() => {
    createVisitSpy = jest.fn();
    request = {
      method: "POST",
      body: {
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactEmail: "bob@example.com",
        contactName: "John Smith",
        callTime: frozenTime,
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
    };
    container = {
      getCreateVisit: () => createVisitSpy,
      getRetrieveWardById: () => getRetrieveWardByIdSpy,
      getUserIsAuthenticated: () => validUserIsAuthenticatedSpy,
      getRetrieveTrustById: () => getRetrieveWherebyTrustByIdSpy,
      getDb: jest.fn().mockResolvedValue(() => {}),
      getUpdateWardVisitTotals: () => updateWardVisitTotalsSpy,
      getValidateMobileNumber: () => () => true,
      getValidateEmailAddress: () => () => true,
      getSendBookingNotification: () => sendBookingNotificationSpy,
    };

    process.env.WHEREBY_API_KEY = "meow";

    fetch.mockReturnValue({
      json: () => ({ roomUrl: "http://meow.cat/fakeUrl" }),
    });
  });

  it("sends a booking notification", async () => {
    await bookAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(201);
    expect(sendBookingNotificationSpy).toHaveBeenCalledWith({
      mobileNumber: "07123456789",
      emailAddress: "bob@example.com",
      wardName: "Fake Ward",
      hospitalName: "Fake Hospital",
      visitDateAndTime: frozenTime,
    });
  });

  it("returns a 400 status if unable to send booking notification", async () => {
    const sendBookingNotificationError = jest.fn().mockResolvedValue({
      success: false,
      errors: {
        textMessageError: "Failed to send text message!",
        emailError: "Failed to send email!",
      },
    });

    await bookAVisit(request, response, {
      container: {
        ...container,
        getSendBookingNotification: () => sendBookingNotificationError,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({
        err: {
          textMessageError: "Failed to send text message!",
          emailError: "Failed to send email!",
        },
      })
    );
  });

  it("updates the ward visit totals", async () => {
    await bookAVisit(request, response, { container });

    expect(updateWardVisitTotalsSpy).toHaveBeenCalledWith({
      wardId: 10,
      date: frozenTime,
    });
  });

  it("returns a 401 when there is no token provided", async () => {
    const userIsAuthenticatedSpy = jest.fn().mockResolvedValue(false);

    await bookAVisit(
      {
        method: "POST",
        body: {
          patientName: "Bob Smith",
          contactNumber: "07123456789",
          callTime: "2020-04-05T10:10:10",
        },
        headers: {},
      },
      response,
      {
        container: {
          ...container,
          getUserIsAuthenticated: () => userIsAuthenticatedSpy,
        },
      }
    );

    expect(response.status).toHaveBeenCalledWith(401);
    expect(userIsAuthenticatedSpy).toHaveBeenCalled();
  });

  it("inserts a visit if valid with a mobile number", async () => {
    await bookAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(201);
    expect(createVisitSpy).toHaveBeenCalled();
    expect(createVisitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        callId: "fakeUrl",
        provider: "whereby",
      })
    );
  });

  it("inserts a visit if valid with an email address", async () => {
    request.body = {
      patientName: "Bob Smith",
      contactEmail: "john.smith@madetech.com",
      contactName: "John Smith",
      callTime: frozenTime,
    };

    await bookAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(201);
    expect(createVisitSpy).toHaveBeenCalled();
    expect(createVisitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        patientName: "Bob Smith",
        contactEmail: "john.smith@madetech.com",
        callId: "fakeUrl",
        provider: "whereby",
      })
    );
  });

  it("rejects if email is invalid", async () => {
    request.body = {
      patientName: "Bob Smith",
      contactEmail: "INVALID_EMAIL",
      contactName: "John Smith",
      callTime: frozenTime,
    };
    await bookAVisit(request, response, {
      container: {
        ...container,
        getValidateEmailAddress: () => () => false,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(createVisitSpy).not.toHaveBeenCalled();
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({
        err: { contactEmail: "contactEmail must be a valid email address" },
      })
    );
  });

  it("inserts rejects if phone number is invalid", async () => {
    request.body = {
      patientName: "Bob Smith",
      contactNumber: "INVALID_NUMBER",
      contactName: "John Smith",
      callTime: frozenTime,
    };
    await bookAVisit(request, response, {
      container: {
        ...container,
        getValidateMobileNumber: () => () => false,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(createVisitSpy).not.toHaveBeenCalled();
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({
        err: { contactNumber: "contactNumber must be a valid mobile number" },
      })
    );
  });

  it("inserts rejects if neither email nor phone number are present", async () => {
    request.body = {
      patientName: "Bob Smith",
      contactName: "John Smith",
      callTime: frozenTime,
    };
    await bookAVisit(request, response, { container });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(createVisitSpy).not.toHaveBeenCalled();
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({
        err: {
          contactEmail: "contactNumber or contactEmail must be present",
          contactNumber: "contactNumber or contactEmail must be present",
        },
      })
    );
  });

  describe("Whereby", () => {
    it("Provides the correct bearer token", async () => {
      await bookAVisit(request, response, {
        container: {
          ...container,
          getCreateVisit: () => createVisitSpy,
        },
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          headers: {
            authorization: "Bearer meow",
            "content-type": "application/json",
          },
        })
      );
    });
  });

  describe("Select provider", () => {
    it("Uses jitsi when whereby is not enabled", async () => {
      container.getRetrieveTrustById = () => getRetrieveJitsiTrustByIdSpy;

      await bookAVisit(request, response, { container });

      expect(createVisitSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          provider: "jitsi",
        })
      );
    });

    it("Uses whereby when enabled", async () => {
      container.getRetrieveTrustById = () => getRetrieveWherebyTrustByIdSpy;

      await bookAVisit(request, response, { container });

      expect(createVisitSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          provider: "whereby",
        })
      );
    });
  });
});
