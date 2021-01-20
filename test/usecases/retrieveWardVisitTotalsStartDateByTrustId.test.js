import retrieveWardVisitTotalsStartDateByTrustId from "../../src/usecases/retrieveWardVisitTotalsStartDateByTrustId";

describe("retrieveWardVisitTotalsStartDateByTrustId", () => {
  it("returns the error if database throws an error", async () => {
    const trustId = 1;
    const container = {
      getRetrieveWardVisitTotalsStartDateByTrustIdGateway: () => async () => ({
        error: "Error!"
      }),
    };

    const { error } = await retrieveWardVisitTotalsStartDateByTrustId(
      container
    )(trustId);

    expect(error).toEqual("Error!");
  });
});
