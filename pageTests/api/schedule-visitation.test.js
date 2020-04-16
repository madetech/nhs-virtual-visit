import scheduleVisitation from "../../pages/api/schedule-visitation";

jest.mock("notifications-node-client");

describe("schedule-visitation", () => {
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
      getCreateVisitation: jest.fn(),
      getDb: jest.fn(),
    };
  });

  it("inserts a visitation if valid", async () => {
    const createVisitationSpy = jest.fn();

    await scheduleVisitation(
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
          getCreateVisitation: () => createVisitationSpy,
        },
      }
    );

    expect(res.status).toHaveBeenCalledWith(201);

    expect(createVisitationSpy).toHaveBeenCalled();

    expect(createVisitationSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        patientName: "Bob Smith",
        contactNumber: "07123456789",
      })
    );
  });
});
