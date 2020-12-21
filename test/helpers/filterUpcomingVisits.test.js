import MockDate from "mockdate";
import filterUpcomingVisits from "../../src/helpers/filterUpcomingVisits";

describe("filterUpcomingVisits", () => {
  beforeEach(() => {
    MockDate.set(new Date("2020-05-18"));
  });

  afterEach(() => {
    MockDate.reset();
  });

  it("returns visits that are scheduled after today", () => {
    const visits = [
      { callTime: "2020-05-17 23:59:59" },
      { callTime: "2020-05-18 13:00:00" },
      { callTime: "2020-05-18 13:00:00" },
      { callTime: "2020-05-19 01:00:00" },
      { callTime: "2020-05-20 09:00:00" },
    ];

    expect(filterUpcomingVisits(visits)).toEqual([
      { callTime: "2020-05-19 01:00:00" },
      { callTime: "2020-05-20 09:00:00" },
    ]);
  });

  it("returns visits on and after midnight today", () => {
    const visits = [
      { callTime: "2020-05-18 23:59:59" },
      { callTime: "2020-05-19 00:00:00" },
      { callTime: "2020-05-19 00:00:01" },
    ];

    expect(filterUpcomingVisits(visits)).toEqual([
      { callTime: "2020-05-19 00:00:00" },
      { callTime: "2020-05-19 00:00:01" },
    ]);
  });
});
