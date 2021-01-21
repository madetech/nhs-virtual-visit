import retrieveAverageParticipantsInVisit from "../../src/usecases/retrieveAverageParticipantsInVisit";

describe("retrieveAverageParticipantsInVisit", () => {
  const trustId = 1;

  let gwAnySpy;

  beforeEach(() => {
    gwAnySpy = jest.fn().mockResolvedValue({
      averageParticipantsInVisit: 3.5,
      error: null,
    });
  });

  it("returns an error if a trustId is not provided", async () => {
    const container = {};

    const { error } = await retrieveAverageParticipantsInVisit(container)();

    expect(error).toEqual("A trustId must be provided.");
  });

  it("retrieves events from the database with the trustId", async () => {
    const container = {
      getRetrieveAverageParticipantsInVisitGateway: () => gwAnySpy,
    };

    await retrieveAverageParticipantsInVisit(container)(trustId);

    expect(gwAnySpy).toHaveBeenCalledWith(trustId);
  });

  it("returns the average number of participants in a visit", async () => {
    const container = {
      getRetrieveAverageParticipantsInVisitGateway: () => gwAnySpy,
    };

    const {
      averageParticipantsInVisit,
      error,
    } = await retrieveAverageParticipantsInVisit(container)(trustId);

    expect(averageParticipantsInVisit).toEqual(3.5);
    expect(error).toBeNull();
  });
});
