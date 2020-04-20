import scheduleVisit from "../../pages/api/schedule-visit";

jest.mock("notifications-node-client");

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
      getCreateVisit: jest.fn(),
      getDb: jest.fn(),
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
      })
    );
  });
});
