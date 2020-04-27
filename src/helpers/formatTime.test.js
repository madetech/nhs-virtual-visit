import formatTime from "./formatTime";

describe("formatTime", () => {
  it("returns the formatted time", () => {
    expect(formatTime("2020-04-05T10:10:10")).toEqual("10:10am");
  });
});
