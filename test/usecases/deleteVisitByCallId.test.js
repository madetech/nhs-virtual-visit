import deleteVisitByCallId from "../../src/usecases/deleteVisitByCallId";

describe("deleteVisitByCallId", () => {
  it("returns an error if there is no callId", async () => {
    const callId = "";

    const container = {
      getDeleteVisitByCallIdGateway: () =>
        jest.fn().mockReturnValue({
          success: true,
          error: null,
        }),
    };

    const { success, error } = await deleteVisitByCallId(container)(callId);

    expect(success).toBe(false);
    expect(error).toEqual("callId is not defined");
  });

  it("returns a json object containing the result", async () => {
    const container = {
      getDeleteVisitByCallIdGateway: () =>
        jest.fn().mockReturnValue({
          success: true,
          error: null,
        }),
    };

    const { success, error } = await deleteVisitByCallId(container)(
      "cb238rfv23cuv3"
    );

    expect(error).toBeNull();
    expect(success).toEqual(true);
  });

  it("returns an error object on db exception", async () => {
    const container = {
      getDeleteVisitByCallIdGateway: () =>
        jest.fn().mockReturnValue({
          success: false,
          error: "Error: DB Error!",
        }),
    };

    const { success, error } = await deleteVisitByCallId(container)(
      "cb238rfv23cuv3"
    );
    expect(error).toEqual("Error: DB Error!");
    expect(success).toEqual(false);
  });
});
