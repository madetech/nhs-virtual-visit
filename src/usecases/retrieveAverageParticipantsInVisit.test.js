import retrieveAverageParticipantsInVisit from "./retrieveAverageParticipantsInVisit";

describe("retrieveAverageParticipantsInVisit", () => {
  const trustId = 1;

  let dbAnySpy;

  beforeEach(() => {
    dbAnySpy = jest.fn().mockResolvedValue([{ average_participants: "3.5" }]);
  });

  it("returns an error if a trustId is not provided", async () => {
    const container = {
      async getDb() {
        return { any: dbAnySpy };
      },
    };

    const { error } = await retrieveAverageParticipantsInVisit(container)();

    expect(error).toEqual("A trustId must be provided.");
  });

  it("retrieves events from the database with the trustId", async () => {
    const container = {
      async getDb() {
        return { any: dbAnySpy };
      },
    };

    await retrieveAverageParticipantsInVisit(container)(trustId);

    expect(dbAnySpy).toHaveBeenCalledWith(expect.anything(), trustId);
  });

  it("returns the average number of participants in a visit", async () => {
    const container = {
      async getDb() {
        return { any: dbAnySpy };
      },
    };

    const {
      averageParticipantsInVisit,
      error,
    } = await retrieveAverageParticipantsInVisit(container)(trustId);

    expect(averageParticipantsInVisit).toEqual(3.5);
    expect(error).toBeNull();
  });
});
