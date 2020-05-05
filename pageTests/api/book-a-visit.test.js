import TemplateStore from "../../src/gateways/GovNotify/TemplateStore";
import bookAVisit from "../../pages/api/book-a-visit";
import fetch from "node-fetch";
import moment from "moment";
import formatDate from "../../src/helpers/formatDate";
import formatTime from "../../src/helpers/formatTime";

jest.mock("notifications-node-client");
jest.mock("node-fetch");

const frozenTime = moment();

describe("/api/book-a-visit", () => {
  let validRequest;
  let response;
  let container;
  const validUserIsAuthenticatedSpy = jest.fn(() => ({
    wardId: 10,
    ward: "MEOW",
  }));

  const updateWardVisitTotalsSpy = jest.fn(() => ({
    success: true,
  }));

  const getWardByIdSpy = jest.fn(() => ({
    ward: {
      id: 10,
      name: "Fake Ward",
      hospitalName: "Fake Hospital",
      code: "MEOW",
    },
    error: null,
  }));

  beforeEach(() => {
    validRequest = {
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
      getCreateVisit: jest.fn().mockReturnValue(() => {}),
      getWardById: () => getWardByIdSpy,
      getUserIsAuthenticated: () => validUserIsAuthenticatedSpy,
      getDb: jest.fn().mockResolvedValue(() => {}),
      getSendTextMessage: () => () => ({ success: true, error: null }),
      getUpdateWardVisitTotals: () => updateWardVisitTotalsSpy,
    };
    process.env.ENABLE_WHEREBY = "yes";
    process.env.WHEREBY_API_KEY = "meow";

    fetch.mockReturnValue({
      json: () => ({ roomUrl: "http://meow.cat/fakeUrl" }),
    });
  });

  afterEach(() => {
    process.env.SMS_INITIAL_TEMPLATE_ID = undefined;
  });
  it("sends a text message", async () => {
    const sendTextMessageSpy = jest
      .fn()
      .mockReturnValue({ success: true, error: null });

    await bookAVisit(validRequest, response, {
      container: {
        ...container,
        getSendTextMessage: () => sendTextMessageSpy,
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
  });

  it("updates the ward visit totals", async () => {
    await bookAVisit(validRequest, response, { container });

    expect(updateWardVisitTotalsSpy).toHaveBeenCalledWith({
      wardId: 10,
      date: frozenTime,
    });
  });

  it("returns a 401 when there is no token provided", async () => {
    const userIsAuthenticatedSpy = jest.fn().mockReturnValue(false);

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

  describe("when sending a text message", () => {
    it("returns a 201 status if successful", async () => {
      const sendTextMessageStub = jest
        .fn()
        .mockReturnValue({ success: true, error: null });

      await bookAVisit(validRequest, response, {
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

      await bookAVisit(validRequest, response, {
        container: {
          ...container,
          getSendTextMessage: () => sendTextMessageStub,
        },
      });

      expect(response.status).toHaveBeenCalledWith(400);
    });
  });

  describe("Whereby", () => {
    it("Provides the correct bearer token", async () => {
      const createVisitSpy = jest.fn();

      await bookAVisit(validRequest, response, {
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

      await bookAVisit(validRequest, response, {
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
  describe("jitsi", () => {
    beforeEach(() => {
      process.env.ENABLE_WHEREBY = "no";
    });

    it("inserts a visit if valid", async () => {
      const createVisitSpy = jest.fn();

      await bookAVisit(validRequest, response, {
        container: {
          ...container,
          getCreateVisit: () => createVisitSpy,
        },
      });

      expect(response.status).toHaveBeenCalledWith(201);
      expect(getWardByIdSpy).toHaveBeenCalledWith(10);
      expect(createVisitSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          patientName: "Bob Smith",
          contactNumber: "07123456789",
          contactName: "John Smith",
          provider: "jitsi",
          wardId: 10,
        })
      );
    });
  });
});
