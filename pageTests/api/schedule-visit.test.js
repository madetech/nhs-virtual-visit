import scheduleVisit from "../../pages/api/schedule-visit";
import fetch from "node-fetch";
import { tryGetPreviewData } from "next/dist/next-server/server/api-utils";

jest.mock("notifications-node-client");
jest.mock("node-fetch");

describe("schedule-visit", () => {
  let validRequest;
  let response;
  let container;

  beforeEach(() => {
    validRequest = {
      method: "POST",
      body: {
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactName: "John Smith",
        callTime: "2020-04-05T10:10:10",
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
      getCreateVisit: jest.fn().mockReturnValue(() => {}),
      getUserIsAuthenticated: jest
        .fn()
        .mockReturnValue((cookie) => cookie === "token=valid.token.value"),
      getDb: jest.fn().mockResolvedValue(() => {}),
      getSendTextMessage: () => () => ({ success: true, error: null }),
    };
    process.env.SMS_INITIAL_TEMPLATE_ID = "meow-woof-quack";
  });

  afterEach(() => {
    process.env.SMS_INITIAL_TEMPLATE_ID = undefined;
  });

  it("inserts a visit if valid", async () => {
    const createVisitSpy = jest.fn();

    await scheduleVisit(validRequest, response, {
      container: {
        ...container,
        getCreateVisit: () => createVisitSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(201);
    expect(createVisitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactName: "John Smith",
        provider: "jitsi",
      })
    );
  });

  it("sends a text message", async () => {
    const sendTextMessageSpy = jest
      .fn()
      .mockReturnValue({ success: true, error: null });

    await scheduleVisit(validRequest, response, {
      container: {
        ...container,
        getSendTextMessage: () => sendTextMessageSpy,
      },
    });

    expect(sendTextMessageSpy).toHaveBeenCalledWith(
      "meow-woof-quack",
      "07123456789",
      {
        ward_name: "Defoe Ward",
        hospital_name: "Northwick Park Hospital",
        visit_date: "5 April 2020",
        visit_time: "10:10am",
      },
      null
    );
  });

  it("returns a 401 when there is no token provided", async () => {
    const userIsAuthenticatedSpy = jest.fn().mockReturnValue(false);

    await scheduleVisit(
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

  describe("when sending a text message", () => {
    it("returns a 201 status if successful", async () => {
      const sendTextMessageStub = jest
        .fn()
        .mockReturnValue({ success: true, error: null });

      await scheduleVisit(validRequest, response, {
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

      await scheduleVisit(validRequest, response, {
        container: {
          ...container,
          getSendTextMessage: () => sendTextMessageStub,
        },
      });

      expect(response.status).toHaveBeenCalledWith(400);
    });
  });

  describe("Whereby", () => {
    beforeEach(() => {
      process.env.ENABLE_WHEREBY = "yes";
      process.env.WHEREBY_API_KEY = "meow";

      fetch.mockReturnValue({
        json: () => ({ roomUrl: "http://meow.cat/fakeUrl" }),
      });
    });

    afterEach(() => {
      process.env.ENABLE_WHEREBY = undefined;
      process.env.WHEREBY_API_KEY = undefined;
    });

    it("Provides the correct bearer token", async () => {
      const createVisitSpy = jest.fn();

      await scheduleVisit(validRequest, response, {
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

    it("inserts a visit if valid", async () => {
      const createVisitSpy = jest.fn();

      await scheduleVisit(validRequest, response, {
        container: {
          ...container,
          getCreateVisit: () => createVisitSpy,
        },
      });

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
  });
});
