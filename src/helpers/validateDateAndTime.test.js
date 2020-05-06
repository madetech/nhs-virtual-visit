import moment from "moment";
import validateDateAndTime from "./validateDateAndTime";

describe("validateDateAndTime", () => {
  it("accepts a valid date and time", () => {
    const { isValidDate, isValidTime, _ } = validateDateAndTime(new moment());
    expect(isValidDate).toBe(true);
    expect(isValidTime).toBe(true);
  });
  it("rejects an invalid date and time", () => {
    const { isValidDate, errorMessage } = validateDateAndTime("invalidTime");
    expect(isValidDate).toBe(false);
    expect(errorMessage).toBe("Please enter a valid date");
  });
  it("rejects a date in the past", () => {
    const { isValidTime, errorMessage } = validateDateAndTime(
      "2000-01-01T00:00:00Z"
    );
    expect(isValidTime).toBe(false);
    expect(errorMessage).toBe("Please enter a time in the future");
  });
  it("rejects an invalid date for being too far in the future", () => {
    const currentMoment = new moment();
    const momentInTheFuture = currentMoment.add(4, "years");
    const { isValidDate, errorMessage } = validateDateAndTime(
      momentInTheFuture
    );
    expect(isValidDate).toBe(false);
    expect(errorMessage).toBe(
      "Please enter a time within the next three years"
    );
  });
  it("reject an invalid date", () => {
    const { isValidDate, errorMessage } = validateDateAndTime(
      "20rr-04-04T04:00:00Z"
    );
    expect(isValidDate).toBe(false);
    expect(errorMessage).toBe("Please enter a valid date");
  });
  it("reject an invalid time", () => {
    const { isValidTime, errorMessage } = validateDateAndTime(
      "2020-04-04T00:90:00Z"
    );
    expect(isValidTime).toBe(false);
    expect(errorMessage).toBe("Please enter a valid time");
  });
  it("accepts a date in the near future", () => {
    const currentMoment = new moment();
    const threeDaysLater = currentMoment.add(3, "days");
    const { isValidDate, isValidTime, errorMessage } = validateDateAndTime(
      threeDaysLater.format()
    );
    expect(isValidDate).toBe(true);
    expect(isValidTime).toBe(true);
    expect(errorMessage).toBe("");
  });
});
