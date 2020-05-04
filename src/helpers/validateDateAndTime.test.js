import moment from "moment";
import validateDateAndTime from "./validateDateAndTime";

describe("validateDateAndTime", () => {
  it("accepts a valid date and time", () => {
    const { isValid, _ } = validateDateAndTime(new moment());
    expect(isValid).toBe(true);
  });
  it("rejects an invalid date and time", () => {
    const { isValid, errorMessage } = validateDateAndTime("invalidTime");
    expect(isValid).toEqual(false);
    expect(errorMessage).toEqual("Please enter a valid date and time");
  });
  it("rejects an invalid date for being too far in the future", () => {
    const currentMoment = new moment();
    const momentInTheFuture = currentMoment.add(4, "years");
    const { isValid, errorMessage } = validateDateAndTime(momentInTheFuture);
    expect(isValid).toEqual(false);
    expect(errorMessage).toEqual(
      "Please enter a time within the next three years"
    );
  });
});
