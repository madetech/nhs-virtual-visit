import AppContainer from "../containers/AppContainer";

describe("retrieveHospitalVisitTotals contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns the total number of visits for each hospital", async () => {
    const { trustId } = await container.getCreateTrust(container)({
      name: "Test Trust",
      adminCode: "TEST",
    });

    const { hospitalId } = await container.getCreateHospital()({
      name: "Test Hospital",
      trustId: trustId,
    });

    const { hospitalId: hospital2Id } = await container.getCreateHospital()({
      name: "Test Hospital 2",
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
      hospitalId: hospital2Id,
      trustId: trustId,
    });

    const date1 = new Date("2020-06-01 13:00");
    const date2 = new Date("2020-06-02 13:00");

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

    await container.getUpdateWardVisitTotals()({
      wardId: ward2Id,
      date: date1.toISOString(),
    });
    await container.getUpdateWardVisitTotals()({
      wardId: ward2Id,
      date: date2.toISOString(),
    });

    await container.getUpdateWardVisitTotals()({
      wardId: ward3Id,
      date: date1.toISOString(),
    });
    await container.getUpdateWardVisitTotals()({
      wardId: ward3Id,
      date: date2.toISOString(),
    });

    const { byHospital } = await container.getRetrieveHospitalVisitTotals()(
      trustId
    );

    expect(byHospital).toEqual([
      { hospitalId: hospitalId, totalVisits: 5 },
      { hospitalId: hospital2Id, totalVisits: 2 },
    ]);
  });
});
