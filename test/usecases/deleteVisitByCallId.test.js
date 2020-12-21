import deleteVisitByCallId from "../../src/usecases/deleteVisitByCallId";

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

    const { success, error } = await deleteVisitByCallId(container)(
      "cb238rfv23cuv3"
    );

    expect(error).toBeNull();
    expect(success).toEqual(true);
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

    const { success, error } = await deleteVisitByCallId(container)(
      "cb238rfv23cuv3"
    );
    expect(error).toEqual("Error: DB Error!");
    expect(success).toEqual(false);
  });
});
