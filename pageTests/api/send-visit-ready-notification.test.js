import sendVisitReadyNotification from "../../pages/api/send-visit-ready-notification";

describe("send-visit-ready-notification", () => {
  const response = {
    status: jest.fn(),
    end: jest.fn(),
    writeHead: jest.fn().mockReturnValue({ end: () => {} }),
  };

  describe("when a token is not provided", () => {
    it("checks if a token is provided and redirects", async () => {
      const requestWithoutToken = {
        method: "POST",
        body: {
          callId: "much-wow",
          contactNumber: "07123456789",
        },
        headers: {},
      };
      const verifyTokenOrRedirectStub = jest.fn().mockReturnValue(false);

      await sendVisitReadyNotification(requestWithoutToken, response, {
        container: {
          getTokenProvider: () => ({}),
          getVerifyTokenOrRedirect: () => verifyTokenOrRedirectStub,
        },
      });

      expect(verifyTokenOrRedirectStub).toHaveBeenCalledWith(
        requestWithoutToken,
        response,
        {
          tokens: {},
        }
      );
    });
  });

  describe("when a token is provided", () => {
    let requestWithToken;
    const verifyTokenOrRedirectStub = jest.fn().mockReturnValue(true);
    let container = {
      getTokenProvider: () => ({}),
      getVerifyTokenOrRedirect: () => verifyTokenOrRedirectStub,
    };

    beforeEach(() => {
      requestWithToken = {
        method: "POST",
        body: {
          callId: "much-wow",
          contactNumber: "07123456789",
        },
        headers: { cookie: "token=valid.token.value" },
      };
      process.env.TEMPLATE_ID = "meow-woof-quack";
      process.env.ORIGIN = "http://localhost:3000";
    });

    afterEach(() => {
      process.env.TEMPLATE_ID = undefined;
      process.env.ORIGIN = undefined;
    });

    it("returns 406 if not POST method", async () => {
      requestWithToken.method = "GET";

      await sendVisitReadyNotification(requestWithToken, response, {
        container: container,
      });

      expect(response.status).toHaveBeenCalledWith(406);
    });

    it("sends a text message", async () => {
      const sendTextMessageSpy = jest
        .fn()
        .mockReturnValue({ success: true, error: null });

      await sendVisitReadyNotification(requestWithToken, response, {
        container: {
          getTokenProvider: () => ({}),
          getVerifyTokenOrRedirect: () => verifyTokenOrRedirectStub,
          getSendTextMessage: () => sendTextMessageSpy,
        },
      });

      expect(sendTextMessageSpy).toHaveBeenCalledWith(
        "meow-woof-quack",
        "07123456789",
        {
          call_url: "http://localhost:3000/visitors/waiting-room/much-wow",
          ward_name: "Defoe Ward",
          hospital_name: "Northwick Park Hospital",
        },
        null
      );
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
});
