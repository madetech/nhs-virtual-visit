import filterUpcomingVisits from "./filterUpcomingVisits";

describe("filterUpcomingVisits", () => {
  it("returns visits that are scheduled after today", () => {
    const visits = [
      { callTime: "2020-05-17 23:59:59+01" },
      { callTime: "2020-05-18 13:00:00+01" },
      { callTime: "2020-05-18 13:00:00+01" },
      { callTime: "2020-05-19 01:00:00+01" },
      { callTime: "2020-05-20 09:00:00+01" },
    ];

    expect(filterUpcomingVisits(visits)).toEqual([
      { callTime: "2020-05-19 01:00:00+01" },
      { callTime: "2020-05-20 09:00:00+01" },
    ]);
  });

  it("returns visits on and after midnight today", () => {
    const visits = [
      { callTime: "2020-05-18 23:59:59+01" },
      { callTime: "2020-05-19 00:00:00+01" },
      { callTime: "2020-05-19 00:00:01+01" },
    ];

    expect(filterUpcomingVisits(visits)).toEqual([
      { callTime: "2020-05-19 00:00:00+01" },
      { callTime: "2020-05-19 00:00:01+01" },
    ]);
  });
});
