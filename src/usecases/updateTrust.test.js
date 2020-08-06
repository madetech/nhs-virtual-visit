import updateTrust from "./updateTrust";

describe("updateTrust", () => {
  it("only allows supported video providers", async () => {
    const { error } = await updateTrust({ getDb: jest.fn() })({
      id: 1,
      videoProvider: "unsupportedProvider",
    });

    expect(error).toEqual(
      "unsupportedProvider is not a supported video provider."
    );
  });

  it("returns an error if an id isn't present", async () => {
    const { error } = await updateTrust({ getDb: jest.fn() })({
      videoProvider: "whereby",
    });

    expect(error).toEqual("An id must be provided.");
  });

  it("returns an error if the database query errors", async () => {
    const container = {
      async getDb() {
        return {
          oneOrNone: jest.fn(() => {
            throw new Error("fail");
          }),
        };
      },
    };

    const { error, id } = await updateTrust(container)({
      id: 123,
      videoProvider: "whereby",
    });
    expect(error).toEqual("Error: fail");
    expect(id).toBeNull();
  });
});
