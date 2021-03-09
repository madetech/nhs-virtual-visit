import retrieveAverageVisitTimeByTrustId from "../../src/usecases/retrieveAverageVisitTimeByTrustId";
import logger from "../../logger";

describe.skip("retrieveAverageVisitTimeByTrustId", () => {
  const trustId = 1;
  it("formats the average visit time", async () => {
    const anySpy = jest.fn().mockReturnValue(12300);

    const container = {
      getRetrieveAverageVisitTimeByTrustIdGateway() {
        return anySpy;
      },
      logger
    };

    const { averageVisitTime } = await retrieveAverageVisitTimeByTrustId(
      container
    )(trustId);

    expect(averageVisitTime).toEqual("3 hrs, 25 mins");
  });

  it("formats the average visit time when the average visit time is NULL", async () => {
    const anySpy = jest.fn().mockReturnValue(null);

    const container = {
      getRetrieveAverageVisitTimeByTrustIdGateway() {
        return anySpy;
      },
      logger
    };

    const { averageVisitTime } = await retrieveAverageVisitTimeByTrustId(
      container
    )(trustId);

    expect(averageVisitTime).toEqual("0 mins");
  });

  it("returns an error if no trustId is provided", async () => {
    const { error } = await retrieveAverageVisitTimeByTrustId({
      logger
    })();

    expect(error).toEqual("A trustId must be provided.");
  });
});
