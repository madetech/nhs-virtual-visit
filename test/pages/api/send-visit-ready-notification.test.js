import sendVisitReadyNotification from "../../../pages/api/send-visit-ready-notification";
import TemplateStore from "../../../src/gateways/GovNotify/TemplateStore";

describe("send-visit-ready-notification", () => {
  const response = {
    status: jest.fn(),
    end: jest.fn(),
    writeHead: jest.fn().mockReturnValue({ end: () => {} }),
  };
  const validUserIsAuthenticatedSpy = jest.fn().mockResolvedValue({
    wardId: 10,
    ward: "MEOW",
    trustId: 1,
  });
  const retrieveWardByIdSpy = jest.fn(() => ({
    ward: {
      id: 1,
      name: "Defoe Ward",
      hospitalName: "Northwick Park Hospital",
    },
    error: null,
  }));

  let container;
  let sendTextMessageSpy;
  let sendEmailSpy;

  beforeEach(() => {
    sendTextMessageSpy = jest.fn(() => ({ success: true, error: null }));
    sendEmailSpy = jest.fn(() => ({ success: true, error: null }));
    container = {
      getUserIsAuthenticated: () => validUserIsAuthenticatedSpy,
      getSendTextMessage: () => sendTextMessageSpy,
      getSendEmail: () => sendEmailSpy,
      getRetrieveWardById: () => retrieveWardByIdSpy,
    };
  });

  describe("when a token is not provided", () => {
    it("checks if a token is provided and returns a 401 if invalid", async () => {
      const requestWithoutToken = {
        method: "POST",
        body: {
          callId: "much-wow",
          contactNumber: "07123456789",
        },
        headers: {},
      };

      await sendVisitReadyNotification(requestWithoutToken, response, {
        container: {
          ...container,
          getUserIsAuthenticated: () => jest.fn().mockResolvedValue(false),
        },
      });

      expect(response.status).toHaveBeenCalledWith(401);
    });
  });

  describe("when a token is provided", () => {
    let requestWithToken;

    beforeEach(() => {
      requestWithToken = {
        method: "POST",
        body: {
          callId: "much-wow",
          contactNumber: "07123456789",
          contactEmail: "leslie@knope.com",
          callPassword: "securePassword",
        },
        protocol: "http",
        headers: { host: "localhost:3000", cookie: "token=valid.token.value" },
      };
    });

    it("returns 406 if not POST method", async () => {
      requestWithToken.method = "GET";

      await sendVisitReadyNotification(requestWithToken, response, {
        container,
      });

      expect(response.status).toHaveBeenCalledWith(406);
    });

    describe("when a phone number is provided", () => {
      beforeEach(() => {
        requestWithToken.body = {
          callId: "much-wow",
          contactNumber: "07123456789",
          callPassword: "securePassword",
        };
      });

      it("sends a text message", async () => {
        sendEmailSpy = jest.fn();

        await sendVisitReadyNotification(requestWithToken, response, {
          container: {
            ...container,
            getSendEmail: () => sendEmailSpy,
          },
        });

        expect(sendTextMessageSpy).toHaveBeenCalledWith(
          TemplateStore().secondText.templateId,
          "07123456789",
          {
            call_url:
              "http://localhost:3000/visitors/much-wow/start?callPassword=securePassword",
            ward_name: "Defoe Ward",
            hospital_name: "Northwick Park Hospital",
          },
          null
        );
        expect(sendEmailSpy).not.toHaveBeenCalled();
      });

      it("returns 201 if successfully sends a text message", async () => {
        const sendTextMessageStub = jest
          .fn()
          .mockReturnValue({ success: true, error: null });

        await sendVisitReadyNotification(requestWithToken, response, {
          container: {
            ...container,
            getSendTextMessage: () => sendTextMessageStub,
          },
        });

        expect(response.status).toHaveBeenCalledWith(201);
        expect(retrieveWardByIdSpy).toHaveBeenCalledWith(10, 1);
      });

      it("returns 400 if unable to send a text message", async () => {
        const sendTextMessageStub = jest
          .fn()
          .mockReturnValue({ success: false, error: "Error message" });

        await sendVisitReadyNotification(requestWithToken, response, {
          container: {
            ...container,
            getSendTextMessage: () => sendTextMessageStub,
          },
        });

        expect(response.status).toHaveBeenCalledWith(400);
      });
    });

    describe("when an email address is provided", () => {
      beforeEach(() => {
        requestWithToken.body = {
          callId: "much-wow",
          contactEmail: "leslie@knope.com",
          callPassword: "securePassword",
        };
      });

      it("sends an email", async () => {
        sendTextMessageSpy = jest.fn();

        await sendVisitReadyNotification(requestWithToken, response, {
          container: {
            ...container,
            getSendTextMessage: () => sendTextMessageSpy,
          },
        });

        expect(sendEmailSpy).toHaveBeenCalledWith(
          TemplateStore().secondEmail.templateId,
          "leslie@knope.com",
          {
            call_url:
              "http://localhost:3000/visitors/much-wow/start?callPassword=securePassword",
            ward_name: "Defoe Ward",
            hospital_name: "Northwick Park Hospital",
          },
          null
        );
        expect(sendTextMessageSpy).not.toHaveBeenCalled();
      });

      it("returns 201 if successfully sends an email", async () => {
        await sendVisitReadyNotification(requestWithToken, response, {
          container,
        });

        expect(response.status).toHaveBeenCalledWith(201);
      });

      it("returns 400 if unable to send an email", async () => {
        const sendEmailStub = jest
          .fn()
          .mockReturnValue({ success: false, error: "Error message" });

        await sendVisitReadyNotification(requestWithToken, response, {
          container: {
            ...container,
            getSendEmail: () => sendEmailStub,
          },
        });

        expect(response.status).toHaveBeenCalledWith(400);
      });
    });

    describe("when a phone number and an email address is provided", () => {
      it("sends a text message and an email", async () => {
        await sendVisitReadyNotification(requestWithToken, response, {
          container,
        });

        expect(sendEmailSpy).toHaveBeenCalled();
        expect(sendTextMessageSpy).toHaveBeenCalled();
      });

      it("returns 201 if successfully sends an text message and email", async () => {
        await sendVisitReadyNotification(requestWithToken, response, {
          container,
        });

        expect(response.status).toHaveBeenCalledWith(201);
      });

      it("returns 400 if unable to send a text message", async () => {
        const sendTextMessageStub = jest
          .fn()
          .mockReturnValue({ success: false, error: "Error message" });

        await sendVisitReadyNotification(requestWithToken, response, {
          container: {
            ...container,
            getSendTextMessage: () => sendTextMessageStub,
          },
        });

        expect(response.status).toHaveBeenCalledWith(400);
      });

      it("returns 400 if unable to send an email", async () => {
        const sendEmailStub = jest
          .fn()
          .mockReturnValue({ success: false, error: "Error message" });

        await sendVisitReadyNotification(requestWithToken, response, {
          container: {
            ...container,
            getSendEmail: () => sendEmailStub,
          },
        });

        expect(response.status).toHaveBeenCalledWith(400);
      });
    });

    describe("in a production environment", () => {
      beforeEach(() => {
        process.env.NODE_ENV = "production";
      });

      afterEach(() => {
        process.env.NODE_ENV = "test";
      });

      it("sends a text message with https", async () => {
        await sendVisitReadyNotification(requestWithToken, response, {
          container,
        });

        expect(sendTextMessageSpy).toHaveBeenCalledWith(
          TemplateStore().secondText.templateId,
          "07123456789",
          {
            call_url:
              "https://localhost:3000/visitors/much-wow/start?callPassword=securePassword",
            ward_name: "Defoe Ward",
            hospital_name: "Northwick Park Hospital",
          },
          null
        );
      });
    });
  });
});
