import JitsiCallIdProvider from "./JitsiCallIdProvider";
import RandomIdProvider from "../RandomIdProvider";

jest.mock("../RandomIdProvider", () => {
  return jest.fn().mockImplementation(() => {
    return { generate: jest.fn().mockReturnValue("randomId") };
  });
});

describe("JitsiCallIdProvider", () => {
  beforeEach(() => {
    RandomIdProvider.mockClear();
  });

  it("generates a call ID for use with Jitsi", () => {
    const callIdProvider = new JitsiCallIdProvider();
    expect(callIdProvider.generate()).toEqual("randomId");
  });
});
