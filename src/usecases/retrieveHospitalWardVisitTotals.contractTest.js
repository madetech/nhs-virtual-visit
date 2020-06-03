import AppContainer from "../containers/AppContainer";

describe("retrieveHospitalWardVisitTotals contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns the total number of visits for each hospital", async () => {
    const { trustId } = await container.getCreateTrust()({
      name: "Test Trust",
      adminCode: "TEST",
    });

    const { hospitalId } = await container.getCreateHospital()({
      name: "Test Hospital",
      trustId: trustId,
    });

    const { wardId: ward1Id } = await container.getCreateWard()({
      name: "Test Ward 1",
      code: "wardCode1",
      hospitalId: hospitalId,
      trustId: trustId,
    });

    const { wardId: ward2Id } = await container.getCreateWard()({
      name: "Test Ward 2",
      code: "wardCode2",
      hospitalId: hospitalId,
      trustId: trustId,
    });

    const { wardId: ward3Id } = await container.getCreateWard()({
      name: "Test Ward 3",
      code: "wardCode3",
      hospitalId: hospitalId,
      trustId: trustId,
    });

    const date1 = new Date("2020-06-01 13:00");
    const date2 = new Date("2020-06-02 13:00");

    // 3 visits for Ward 1
    await container.getUpdateWardVisitTotals()({
      wardId: ward1Id,
      date: date1.toISOString(),
    });
    await container.getUpdateWardVisitTotals()({
      wardId: ward1Id,
      date: date1.toISOString(),
    });
    await container.getUpdateWardVisitTotals()({
      wardId: ward1Id,
      date: date2.toISOString(),
    });

    //  1 visit for Ward 2
    await container.getUpdateWardVisitTotals()({
      wardId: ward2Id,
      date: date1.toISOString(),
    });

    // 2 visits for Ward 3
    await container.getUpdateWardVisitTotals()({
      wardId: ward3Id,
      date: date1.toISOString(),
    });
    await container.getUpdateWardVisitTotals()({
      wardId: ward3Id,
      date: date2.toISOString(),
    });

    const {
      wards,
      mostVisited,
      leastVisited,
    } = await container.getRetrieveHospitalWardVisitTotals()(hospitalId);

    expect(Object.keys(wards).length).toEqual(3);
    expect(wards[ward1Id]).toEqual(3);
    expect(wards[ward2Id]).toEqual(1);
    expect(wards[ward3Id]).toEqual(2);

    expect(mostVisited).toEqual({
      wardName: "Test Ward 1",
      total_visits: 3,
    });
    expect(leastVisited).toEqual({
      wardName: "Test Ward 2",
      total_visits: 1,
    });
  });

  it("returns an empty object if no hospitalId is provided", async () => {
    const response = await container.getRetrieveHospitalWardVisitTotals()();
    expect(response).toEqual({
      wards: [],
      mostVisited: { wardName: "", total_visits: 0 },
      leastVisited: { wardName: "", total_visits: 0 },
    });
  });

  it("returns an empty object if the hospitalId does not exist", async () => {
    const response = await container.getRetrieveHospitalWardVisitTotals()(12);
    expect(response).toEqual({
      wards: [],
      mostVisited: { wardName: "", total_visits: 0 },
      leastVisited: { wardName: "", total_visits: 0 },
    });
  });
});
