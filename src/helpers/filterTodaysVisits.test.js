import filterTodaysVisits from "./filterTodaysVisits";

describe("filterTodaysVisits", () => {
  it("returns visits that are scheduled for today", () => {
    const visits = [
      { callTime: "2020-05-17 23:59:59+01" },
      { callTime: "2020-05-18 13:00:00+01" },
      { callTime: "2020-05-18 13:00:00+01" },
      { callTime: "2020-05-19 01:00:00+01" },
    ];

    expect(filterTodaysVisits(visits)).toEqual([
      { callTime: "2020-05-18 13:00:00+01" },
      { callTime: "2020-05-18 13:00:00+01" },
    ]);
  });

  it("returns visits that are before midnight", () => {
    const visits = [
      { callTime: "2020-05-18 23:59:59+01" },
      { callTime: "2020-05-19 00:00:00+01" },
      { callTime: "2020-05-19 00:00:01+01" },
    ];

    expect(filterTodaysVisits(visits)).toEqual([
      { callTime: "2020-05-18 23:59:59+01" },
    ]);
  });
});
