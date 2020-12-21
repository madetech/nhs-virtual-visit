import retrieveReportingStartDateByTrustId from "../../src/usecases/retrieveReportingStartDateByTrustId";

describe("retrieveReportingStartDateByTrustId", () => {
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

    const { error } = await retrieveReportingStartDateByTrustId(container)(
      trustId
    );

    expect(error).toEqual("Error!");
  });
});
