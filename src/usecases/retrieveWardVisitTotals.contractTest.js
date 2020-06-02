import AppContainer from "../containers/AppContainer";

describe("retrieveWardVisitTotals contract tests", () => {
  const container = AppContainer.getInstance();
  const date1 = new Date("2020-06-01 13:00");
  const date2 = new Date("2020-06-02 13:00");

  describe("when a trustID isn't provided", () => {
    it("returns the number of booked visits for the service and by all wards", async () => {
      // A trust with 1 hospital and 2 wards
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

      // A trust with 1 hospital and 1 ward
      const { trustId: trust2Id } = await container.getCreateTrust()({
        name: "Test Trust 2",
        adminCode: "TEST2",
      });
      const { hospitalId: hospital2Id } = await container.getCreateHospital()({
        name: "Test Hospital 2",
        trustId: trust2Id,
      });
      const { wardId: ward3Id } = await container.getCreateWard()({
        name: "Test Ward 3",
        code: "wardCode3",
        hospitalId: hospital2Id,
        trustId: trust2Id,
      });

      await container.getUpdateWardVisitTotals()({
        wardId: ward1Id,
        date: date1.toISOString(),
      });
      await container.getUpdateWardVisitTotals()({
        wardId: ward1Id,
        date: date1.toISOString(),
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
        date: date2.toISOString(),
      });

      const { total, byWard } = await container.getRetrieveWardVisitTotals()();

      expect(total).toEqual(5);
      expect(byWard).toEqual([
        {
          hospitalName: "Test Hospital",
          name: "Test Ward 1",
          visits: 2,
          trustId: trustId,
        },
        {
          hospitalName: "Test Hospital",
          name: "Test Ward 2",
          visits: 2,
          trustId: trustId,
        },
        {
          hospitalName: "Test Hospital 2",
          name: "Test Ward 3",
          visits: 1,
          trustId: trust2Id,
        },
      ]);
    });
  });

  describe("when a trustID is provided", () => {
    it("returns the number of booked visits for the trust and by ward", async () => {
      // A trust with 1 hospital and 2 wards
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

      // A trust with 1 hospital and 1 ward
      const { trustId: trust2Id } = await container.getCreateTrust()({
        name: "Test Trust 2",
        adminCode: "TEST2",
      });
      const { hospitalId: hospital2Id } = await container.getCreateHospital()({
        name: "Test Hospital 2",
        trustId: trust2Id,
      });
      const { wardId: ward3Id } = await container.getCreateWard()({
        name: "Test Ward 3",
        code: "wardCode3",
        hospitalId: hospital2Id,
        trustId: trust2Id,
      });

      await container.getUpdateWardVisitTotals()({
        wardId: ward1Id,
        date: date1.toISOString(),
      });
      await container.getUpdateWardVisitTotals()({
        wardId: ward1Id,
        date: date1.toISOString(),
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
        date: date2.toISOString(),
      });

      const { total, byWard } = await container.getRetrieveWardVisitTotals()(
        trustId
      );

      expect(total).toEqual(4);
      expect(byWard).toEqual([
        {
          hospitalName: "Test Hospital",
          name: "Test Ward 1",
          visits: 2,
          trustId: trustId,
        },
        {
          hospitalName: "Test Hospital",
          name: "Test Ward 2",
          visits: 2,
          trustId: trustId,
        },
      ]);
    });
  });
});
