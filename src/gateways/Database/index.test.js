import Database from "./";

describe("database", () => {
  it("Produces a singleton", () => {
    const instanceOne = Database.getInstance();

    expect(instanceOne).toBeDefined();

    const instanceTwo = Database.getInstance();

    expect(instanceOne).toEqual(instanceTwo);
  });
});
