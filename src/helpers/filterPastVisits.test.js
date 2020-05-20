import MockDate from "mockdate";
import filterPastVisits from "./filterPastVisits";

describe("filterPastVisits", () => {
  beforeEach(() => {
    MockDate.set(new Date("2020-05-18"));
  });

  afterEach(() => {
    MockDate.reset();
  });

  it("returns visits that were scheduled in the past", () => {
    const visits = [
      { callTime: "2020-05-17 13:00:00" },
      { callTime: "2020-05-17 23:59:59" },
      { callTime: "2020-05-18 00:00:00" },
      { callTime: "2020-05-18 00:00:01" },
      { callTime: "2020-05-18 13:00:00" },
    ];

    expect(filterPastVisits(visits)).toEqual([
      { callTime: "2020-05-17 13:00:00" },
      { callTime: "2020-05-17 23:59:59" },
    ]);
  });
});
