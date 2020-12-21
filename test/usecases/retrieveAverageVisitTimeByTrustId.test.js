import retrieveAverageVisitTimeByTrustId from "../../src/usecases/retrieveAverageVisitTimeByTrustId";

describe("retrieveAverageVisitTimeByTrustId", () => {
  const trustId = 1;
  it("formats the average visit time", async () => {
    const dbSpy = jest
      .fn()
      .mockResolvedValue([{ average_visit_duration_seconds: 12300 }]);

    const container = {
      async getDb() {
        return { any: dbSpy };
      },
    };

    const { averageVisitTime } = await retrieveAverageVisitTimeByTrustId(
      container
    )(trustId);

    expect(averageVisitTime).toEqual("3 hrs, 25 mins");
  });

  it("formats the average visit time when the average visit time is NULL", async () => {
    const dbSpy = jest
      .fn()
      .mockResolvedValue([{ average_visit_duration_seconds: null }]);

    const container = {
      async getDb() {
        return { any: dbSpy };
      },
    };

    const { averageVisitTime } = await retrieveAverageVisitTimeByTrustId(
      container
    )(trustId);

    expect(averageVisitTime).toEqual("0 mins");
  });

  it("returns an error if no trustId is provided", async () => {
    const { error } = await retrieveAverageVisitTimeByTrustId({
      getDb: jest.fn(),
    })();

    expect(error).toEqual("A trustId must be provided.");
  });
});
