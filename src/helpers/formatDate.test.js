import formatDate from "./formatDate";

describe("formatDate", () => {
  it("returns the formatted date", () => {
    expect(formatDate("2020-04-05T10:10:10")).toEqual("5 April 2020");
  });
});
