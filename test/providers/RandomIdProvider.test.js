import RandomIdProvider from "../../src/providers/RandomIdProvider";

describe("generate", () => {
  it("returns a random ID with 21 length by default", () => {
    const provider = new RandomIdProvider();
    const id = provider.generate();
    expect(id.length).toEqual(21);
  });

  it("returns a random ID matching the provided length", () => {
    const provider = new RandomIdProvider();
    const id = provider.generate(12);
    expect(id.length).toEqual(12);
  });
});
