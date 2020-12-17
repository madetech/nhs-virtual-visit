import CallIdProvider from "./CallIdProvider";
import WherebyCallIdProvider from "./callIdProviders/WherebyCallIdProvider";
jest.mock("./callIdProviders/WherebyCallIdProvider");

describe("CallIdProvider", () => {
  it("returns a call ID for whereby", async () => {
    const callTime = new Date("2020-05-18 13:00");
    const prov = new CallIdProvider("whereby", callTime);
    prov.generate();
    expect(WherebyCallIdProvider).toHaveBeenCalledWith(callTime);
  });

  it("throws an error if the video provider is not supported", async () => {
    const prov = new CallIdProvider("notsupported");
    try {
      await prov.generate();
    } catch (e) {
      expect(e).toEqual("Provider notsupported not supported");
    }
  });
});
