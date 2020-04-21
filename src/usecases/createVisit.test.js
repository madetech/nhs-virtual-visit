import createVisit from "./createVisit";

describe("createVisit", () => {
  it("creates a visit in the db when valid", async () => {
    const callTime = new Date();

    const container = {
      getDb() {
        return {
          ScheduledCall: {
            create: jest.fn().mockReturnValue([
              {
                id: 1,
                patientName: "Bob Smith",
                callTime: callTime,
                contactNumber: "07123456789",
                callId: "12345",
              },
            ]),
          },
        };
      },
    };

    const request = {
      patientName: "Bob Smith",
      contactNumber: "07123456789",
      callTime: callTime,
      callId: "12345",
    };

    const scheduledCalls = await createVisit(container)(request);
    expect(scheduledCalls).toHaveLength(1);

    expect(scheduledCalls[0]).toEqual(
      expect.objectContaining({
        id: 1,
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        callTime: callTime,
        callId: "12345",
      })
    );
  });
});
