import updateTrust from "../../src/usecases/updateTrust";

describe("updateTrust", () => {
  let updateTrustSpy = jest.fn().mockReturnValue({ id: 10, error: null });

  let container;

  beforeEach(() => {
    container = {
      getUpdateTrustGateway: () => updateTrustSpy,
    };
  });

  it("only allows supported video providers", async () => {
    const { error } = await updateTrust(container)({
      trustId: 1,
      videoProvider: "unsupportedProvider",
    });

    expect(error).toEqual(
      "unsupportedProvider is not a supported video provider."
    );
  });

  it("returns an error if an id isn't present", async () => {
    const { error } = await updateTrust(container)({
      videoProvider: "whereby",
    });

    expect(error).toEqual("An id must be provided.");
  });

  it("updates a trust in the db when valid", async () => {
    const { id, error } = await updateTrust(container)({
      videoProvider: "whereby",
      trustId: 10,
    });

    expect(id).toEqual(10);
    expect(error).toBeNull();
  });

  it("returns an error if the database query errors", async () => {
    container.getUpdateTrustGateway = () =>
      jest.fn().mockReturnValue({ id: null, error: "Error: fail" });

    const { error, id } = await updateTrust(container)({
      trustId: 123,
      videoProvider: "whereby",
    });

    expect(error).toEqual("Error: fail");
    expect(id).toBeNull();
  });
});
