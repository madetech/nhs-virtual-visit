import TemplateStore from "../../src/gateways/GovNotify/TemplateStore";
import bookAVisit from "../../pages/api/book-a-visit";
import fetch from "node-fetch";
import moment from "moment";
import formatDate from "../../src/helpers/formatDate";
import formatTime from "../../src/helpers/formatTime";

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

  beforeEach(() => {
    createVisitSpy = jest.fn();
    request = {
      method: "POST",
      body: {
        patientName: "Bob Smith",
        contactNumber: "07123456789",
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
      getSendTextMessage: () => () => ({ success: true, error: null }),
      getSendEmail: () => () => ({ success: true, error: null }),
      getUpdateWardVisitTotals: () => updateWardVisitTotalsSpy,
      getValidateMobileNumber: () => () => true,
      getValidateEmailAddress: () => () => true,
    };

    process.env.WHEREBY_API_KEY = "meow";

    fetch.mockReturnValue({
      json: () => ({ roomUrl: "http://meow.cat/fakeUrl" }),
    });
  });

  describe("when a contact number is provided", () => {
    it("sends a text message", async () => {
      request.body = {
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactName: "John Smith",
        callTime: frozenTime,
      };

      const sendTextMessageSpy = jest
        .fn()
        .mockReturnValue({ success: true, error: null });

      const sendEmailSpy = jest.fn();

      await bookAVisit(request, response, {
        container: {
          ...container,
          getSendTextMessage: () => sendTextMessageSpy,
          getSendEmail: () => sendEmailSpy,
        },
      });

      expect(sendTextMessageSpy).toHaveBeenCalledWith(
        TemplateStore.firstText.templateId,
        "07123456789",
        {
          ward_name: "Fake Ward",
          hospital_name: "Fake Hospital",
          visit_date: formatDate(frozenTime),
          visit_time: formatTime(frozenTime),
        },
        null
      );
      expect(sendEmailSpy).not.toHaveBeenCalled();
    });
  });

  describe("when a contact email is provided", () => {
    it("sends an email", async () => {
      request.body = {
        patientName: "Bob Smith",
        contactEmail: "john@smith.com",
        contactName: "John Smith",
        callTime: frozenTime,
      };

      const sendEmailSpy = jest
        .fn()
        .mockReturnValue({ success: true, error: null });

      const sendTextMessageSpy = jest.fn();

      await bookAVisit(request, response, {
        container: {
          ...container,
          getSendTextMessage: () => sendTextMessageSpy,
          getSendEmail: () => sendEmailSpy,
        },
      });

      expect(sendEmailSpy).toHaveBeenCalledWith(
        TemplateStore.firstEmail.templateId,
        "john@smith.com",
        {
          ward_name: "Fake Ward",
          hospital_name: "Fake Hospital",
          visit_date: formatDate(frozenTime),
          visit_time: formatTime(frozenTime),
        },
        null
      );
      expect(sendTextMessageSpy).not.toHaveBeenCalled();
    });
  });

  describe("when a contact number and contact email are provided", () => {
    it("sends a text message and an email", async () => {
      request.body = {
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactEmail: "john@smith.com",
        contactName: "John Smith",
        callTime: frozenTime,
      };

      const sendEmailSpy = jest.fn();
      const sendTextMessageSpy = jest.fn();

      await bookAVisit(request, response, {
        container: {
          ...container,
          getSendTextMessage: () => sendTextMessageSpy,
          getSendEmail: () => sendEmailSpy,
        },
      });

      expect(sendTextMessageSpy).toHaveBeenCalled();
      expect(sendEmailSpy).toHaveBeenCalled();
    });

    it("returns a 201 status if successful", async () => {
      request.body = {
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactEmail: "john@smith.com",
        contactName: "John Smith",
        callTime: frozenTime,
      };

      await bookAVisit(request, response, { container });

      expect(response.status).toHaveBeenCalledWith(201);
    });

    it("returns a 400 status if error with sending a text", async () => {
      request.body = {
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactEmail: "john@smith.com",
        contactName: "John Smith",
        callTime: frozenTime,
      };

      const sendTextMessageStub = jest
        .fn()
        .mockReturnValue({ success: false, error: "Error message" });
      const sendEmailStub = jest
        .fn()
        .mockReturnValue({ success: true, error: null });

      await bookAVisit(request, response, {
        container: {
          ...container,
          getSendTextMessage: () => sendTextMessageStub,
          getSendEmail: () => sendEmailStub,
        },
      });

      expect(response.status).toHaveBeenCalledWith(400);
    });

    it("returns a 400 status if error with sending an email", async () => {
      request.body = {
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactEmail: "john@smith.com",
        contactName: "John Smith",
        callTime: frozenTime,
      };

      const sendTextMessageStub = jest
        .fn()
        .mockReturnValue({ success: true, error: null });
      const sendEmailStub = jest
        .fn()
        .mockReturnValue({ success: false, error: "Error message" });

      await bookAVisit(request, response, {
        container: {
          ...container,
          getSendTextMessage: () => sendTextMessageStub,
          getSendEmail: () => sendEmailStub,
        },
      });

      expect(response.status).toHaveBeenCalledWith(400);
    });
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

  describe("when sending a text message", () => {
    it("returns a 201 status if successful", async () => {
      const sendTextMessageStub = jest
        .fn()
        .mockReturnValue({ success: true, error: null });

      await bookAVisit(request, response, {
        container: {
          ...container,
          getSendTextMessage: () => sendTextMessageStub,
        },
      });

      expect(response.status).toHaveBeenCalledWith(201);
    });

    it("returns a 400 status if errors", async () => {
      const sendTextMessageStub = jest
        .fn()
        .mockReturnValue({ success: false, error: "Error message" });

      await bookAVisit(request, response, {
        container: {
          ...container,
          getSendTextMessage: () => sendTextMessageStub,
        },
      });

      expect(response.status).toHaveBeenCalledWith(400);
    });
  });

  describe("when sending an email", () => {
    it("returns a 201 status if successful", async () => {
      request.body = {
        patientName: "Bob Smith",
        contactEmail: "john@smith.com",
        contactName: "John Smith",
        callTime: frozenTime,
      };

      const sendEmailStub = jest
        .fn()
        .mockReturnValue({ success: true, error: null });

      await bookAVisit(request, response, {
        container: {
          ...container,
          getSendEmail: () => sendEmailStub,
        },
      });

      expect(response.status).toHaveBeenCalledWith(201);
    });

    it("returns a 400 status if errors", async () => {
      request.body = {
        patientName: "Bob Smith",
        contactEmail: "john@smith.com",
        contactName: "John Smith",
        callTime: frozenTime,
      };

      const sendEmailStub = jest
        .fn()
        .mockReturnValue({ success: false, error: "Error message" });

      await bookAVisit(request, response, {
        container: {
          ...container,
          getSendEmail: () => sendEmailStub,
        },
      });

      expect(response.status).toHaveBeenCalledWith(400);
    });
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
