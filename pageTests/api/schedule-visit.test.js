import scheduleVisit from "../../pages/api/schedule-visit";
import fetch from "node-fetch";

jest.mock("notifications-node-client");
jest.mock("node-fetch");

describe("schedule-visit", () => {
  let req;
  let res;
  let container;

  beforeEach(() => {
    req = {};
    res = {
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
      getDb: jest.fn().mockReturnValue(() => {}),
      getNotifyClient: () => {
        return { sendSms: () => {} };
      },
    };
  });

  it("inserts a visit if valid", async () => {
    const createVisitSpy = jest.fn();

    await scheduleVisit(
      {
        method: "POST",
        body: {
          patientName: "Bob Smith",
          contactNumber: "07123456789",
          callTime: "2020-04-05T10:10:10",
        },
        headers: {
          cookie: "token=valid.token.value",
        },
      },
      res,
      {
        container: {
          ...container,
          getCreateVisit: () => createVisitSpy,
        },
      }
    );

    expect(res.status).toHaveBeenCalledWith(201);

    expect(createVisitSpy).toHaveBeenCalled();

    expect(createVisitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        provider: "jitsi",
      })
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
      res,
      {
        container: {
          ...container,
          getUserIsAuthenticated: () => userIsAuthenticatedSpy,
        },
      }
    );

    expect(res.status).toHaveBeenCalledWith(401);

    expect(userIsAuthenticatedSpy).toHaveBeenCalled();
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

      await scheduleVisit(
        {
          method: "POST",
          body: {
            patientName: "Bob Smith",
            contactNumber: "07123456789",
            callTime: "2020-04-05T10:10:10",
          },
          headers: {
            cookie: "token=valid.token.value",
          },
        },
        res,
        {
          container: {
            ...container,
            getCreateVisit: () => createVisitSpy,
          },
        }
      );

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

      await scheduleVisit(
        {
          method: "POST",
          body: {
            patientName: "Bob Smith",
            contactNumber: "07123456789",
            callTime: "2020-04-05T10:10:10",
          },
          headers: {
            cookie: "token=valid.token.value",
          },
        },
        res,
        {
          container: {
            ...container,
            getCreateVisit: () => createVisitSpy,
          },
        }
      );

      expect(res.status).toHaveBeenCalledWith(201);

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
