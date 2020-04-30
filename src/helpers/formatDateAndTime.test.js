import formatDateAndTime from "./formatDateAndTime";

describe("formatDateAndTime", () => {
  it("returns the formatted date and time", () => {
    expect(formatDateAndTime("2020-04-05T10:10:10")).toEqual(
      "5 April 2020, 10:10am"
    );
  });

  it("returns the formatted date and time with time format provided", () => {
    expect(formatDateAndTime("2020-04-05T17:10:10", "HH:mm")).toEqual(
      "5 April 2020, 17:10"
    );
  });
});
