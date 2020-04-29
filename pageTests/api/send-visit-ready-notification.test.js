import sendVisitReadyNotification from "../../pages/api/send-visit-ready-notification";

describe("send-visit-ready-notification", () => {
  const response = {
    status: jest.fn(),
    end: jest.fn(),
    writeHead: jest.fn().mockReturnValue({ end: () => {} }),
  };

  let container;
  let sendTextMessageSpy;
  beforeEach(() => {
    sendTextMessageSpy = jest.fn(() => ({ success: true, error: null }));
    container = {
      getUserIsAuthenticated: () => () => true,
      getSendTextMessage: () => sendTextMessageSpy,
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

      container.getUserIsAuthenticated = jest.fn(() => () => false);

      await sendVisitReadyNotification(requestWithoutToken, response, {
        container,
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
        container,
      });

      expect(response.status).toHaveBeenCalledWith(406);
    });

    it("sends a text message", async () => {
      await sendVisitReadyNotification(requestWithToken, response, {
        container,
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
