import retrieveReportingStartDateByTrustId from "../../src/usecases/retrieveReportingStartDateByTrustId";
import logger from "../../logger";

describe("retrieveReportingStartDateByTrustId", () => {
  it("returns the error if database throws an error", async () => {
    const trustId = 1;
    const container = {      getRetrieveReportingStartDateByTrustIdGateway: () =>
        jest.fn().mockResolvedValue({
          startDate: null,
          error: "Error!",
        }),
      logger
    };

    const { error } = await retrieveReportingStartDateByTrustId(container)(
      trustId
    );

    expect(error).toEqual("Error!");
  });
});
