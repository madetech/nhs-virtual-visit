import WherebyCallIdProvider from "./WherebyCallIdProvider";
import moment from "moment";
import fetch from "node-fetch";
jest.mock("node-fetch");

const frozenTime = moment("2020-05-18 13:00");

describe("WherebyCallIdProvider", () => {
  beforeEach(() => {
    fetch.mockResolvedValue({
      json: () => ({ roomUrl: "http://example.com/fakeUrl" }),
    });

    process.env.WHEREBY_API_KEY = "wherebyapikey";
  });

  afterEach(() => {
    process.env.WHEREBY_API_KEY = null;
  });

  it("generates a callId for whereby", async () => {
    const callIdProvider = new WherebyCallIdProvider(frozenTime);
    expect(await callIdProvider.generate()).toEqual("fakeUrl");
  });

  it("provides the correct bearer token", async () => {
    const callIdProvider = new WherebyCallIdProvider(frozenTime);
    await callIdProvider.generate();

    expect(fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: {
          authorization: "Bearer wherebyapikey",
          "content-type": "application/json",
        },
      })
    );
  });

  it("provides the correct start and end date", async () => {
    const callIdProvider = new WherebyCallIdProvider(frozenTime);
    await callIdProvider.generate();

    expect(fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        body: JSON.stringify({
          startDate: moment("2020-05-18 13:00").format(),
          endDate: moment("2021-05-18 13:00").format(),
        }),
      })
    );
  });
});
