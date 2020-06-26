import retrieveWardVisitTotalsStartDateByTrustId from "./retrieveWardVisitTotalsStartDateByTrustId";

describe("retrieveWardVisitTotalsStartDateByTrustId", () => {
  it("returns the error if database throws an error", async () => {
    const trustId = 1;
    const container = {
      async getDb() {
        return {
          one: jest.fn().mockImplementation(() => {
            throw new Error("Error!");
          }),
        };
      },
    };

    const { error } = await retrieveWardVisitTotalsStartDateByTrustId(
      container
    )(trustId);

    expect(error).toEqual("Error!");
  });
});
