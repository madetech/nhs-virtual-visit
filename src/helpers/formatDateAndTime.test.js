import formatDateAndTime from "./formatDateAndTime";

describe("formatDateAndTime", () => {
  it("returns the formatted date and time", () => {
    expect(formatDateAndTime("2020-04-05T10:10:10")).toEqual(
      "5 April 2020, 10:10am"
    );
  });
});
