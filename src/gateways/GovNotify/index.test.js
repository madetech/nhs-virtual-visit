import GovNotify from "./";

describe("GovNotify", () => {
  it("Produces a singleton", () => {
    const instanceOne = GovNotify.getInstance();

    expect(instanceOne).toBeDefined();

    const instanceTwo = GovNotify.getInstance();

    expect(instanceOne).toEqual(instanceTwo);
  });
});
