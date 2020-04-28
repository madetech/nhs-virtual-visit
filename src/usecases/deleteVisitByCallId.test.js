import deleteVisitByCallId from "./deleteVisitByCallId";

describe("deleteVisitByCallId", () => {
  it("returns a json object containing the result", async () => {
    const container = {
      async getDb() {
        return {
          any: jest.fn().mockReturnValue([
            {
              sucess: true,
            },
          ]),
        };
      },
    };

    const { result, error } = await deleteVisitByCallId(container)(
      "cb238rfv23cuv3"
    );

    expect(error).toBeNull();
    expect(result).toEqual({
      success: true,
    });
  });

  it("returns an error object on db exception", async () => {
    const container = {
      async getDb() {
        return {
          any: jest.fn(() => {
            throw new Error("DB Error!");
          }),
        };
      },
    };

    const { error } = await deleteVisitByCallId(container)("cb238rfv23cuv3");
    expect(error).toBeDefined();
  });
});
