import retrieveVisits from "../../src/usecases/retrieveVisits";
import { SCHEDULED, COMPLETE } from "../../src/helpers/visitStatus";

describe("retrieveVisits", () => {
  it("returns a json object containing the calls", async () => {
    const container = {
      getRetrieveVisitsGateway: () => async () => ({
        scheduledCalls: [
          {
            id: 1,
            patientName: "Bob",
            callTime: "2020-04-15T23:00:00.000Z",
            recipientNumber: "07700900900",
            recipientEmail: "billy@bob.com",
            recipientName: "Billy",
            callId: "cb238rfv23cuv3",
            provider: "whereby",
            status: SCHEDULED,
          },
          {
            id: 2,
            patientName: "Harry",
            callTime: "2020-04-15T23:00:00.000Z",
            recipientNumber: "07700900900",
            recipientEmail: "bob@bob.com",
            recipientName: "Bob",
            callId: "cb238rfv23cuv3",
            provider: "whereby",
            status: COMPLETE,
          }
        ],
        error: null
      })
    };

    const { scheduledCalls, error } = await retrieveVisits(container)({
      wardId: 1,
    });

    expect(error).toBeNull();
    expect(scheduledCalls).toHaveLength(2);
    expect(scheduledCalls[0]).toEqual({
      id: 1,
      patientName: "Bob",
      callTime: "2020-04-15T23:00:00.000Z",
      recipientNumber: "07700900900",
      recipientEmail: "billy@bob.com",
      recipientName: "Billy",
      callId: "cb238rfv23cuv3",
      provider: "whereby",
      status: SCHEDULED,
    });
    expect(scheduledCalls[1]).toEqual({
      id: 2,
      patientName: "Harry",
      callTime: "2020-04-15T23:00:00.000Z",
      recipientNumber: "07700900900",
      recipientEmail: "bob@bob.com",
      recipientName: "Bob",
      callId: "cb238rfv23cuv3",
      provider: "whereby",
      status: COMPLETE,
    });
  });

  it("returns a query with a 12 hour interval", async () => {
    const container = {
      getRetrieveVisitsGateway: () => async () => ({
        scheduledCalls: []
      })
    };

    await retrieveVisits(container)({
      wardId: 1,
    });
  });

  it("returns an error object on db exception", async () => {
    const container = {
      getRetrieveVisitsGateway: () => async () => ({
        error: "foo"
      })
    };

    const { error } = await retrieveVisits(container)({ wardId: 1 });
    expect(error).toBeDefined();
  });
});
