import JitsiCallIdProvider from "./JitsiCallIdProvider";

jest.mock("../RandomIdProvider", () => {
  return jest.fn().mockImplementation(() => {
    return { generate: jest.fn().mockReturnValue("randomId") };
  });
});

describe("JitsiCallIdProvider", () => {
  it("generates a call ID for use with Jitsi", () => {
    const callIdProvider = new JitsiCallIdProvider();
    expect(callIdProvider.generate()).toEqual("randomId");
  });
});
