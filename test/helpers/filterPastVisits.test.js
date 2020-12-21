import MockDate from "mockdate";
import filterPastVisits from "../../src/helpers/filterPastVisits";

describe("filterPastVisits", () => {
  beforeEach(() => {
    MockDate.set(new Date("2020-05-18 13:00"));
  });

  afterEach(() => {
    MockDate.reset();
  });

  it("returns visits that were scheduled between 1 hour ago and 12 hours ago", () => {
    const visits = [
      { callTime: "2020-05-17 15:00:00" },
      { callTime: "2020-05-18 00:59:59" },
      { callTime: "2020-05-18 01:00:00" },
      { callTime: "2020-05-18 09:00:00" },
      { callTime: "2020-05-18 11:59:59" },
      { callTime: "2020-05-18 12:00:00" },
      { callTime: "2020-05-18 12:00:01" },
      { callTime: "2020-05-18 13:00:00" },
      { callTime: "2020-05-18 15:00:00" },
    ];

    expect(filterPastVisits(visits)).toEqual([
      { callTime: "2020-05-18 01:00:00" },
      { callTime: "2020-05-18 09:00:00" },
      { callTime: "2020-05-18 11:59:59" },
      { callTime: "2020-05-18 12:00:00" },
    ]);
  });
});
