import AppContainer from "../containers/AppContainer";
import { setupTrust, setupHospital, setupWard } from "../testUtils/factories";

describe("retrieveWardVisitTotalsStartDateByTrustId contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns the date of when reporting started for a trust", async () => {
    // A trust with booked visits
    const { trustId: trustId1 } = await setupTrust({ adminCode: "TESTCODE1" });
    const { hospitalId: hospitalId1 } = await setupHospital({
      trustId: trustId1,
    });
    const { wardId: wardId1 } = await setupWard({
      code: "wardCode1",
      hospitalId: hospitalId1,
      trustId: trustId1,
    });

    await container.getUpdateWardVisitTotals()({
      wardId: wardId1,
      date: new Date("2020-12-01T23:00:00.000Z"),
    });
    await container.getUpdateWardVisitTotals()({
      wardId: wardId1,
      date: new Date("2020-06-01T23:00:00.000Z"),
    });

    // Another trust with booked visits
    const { trustId: trustId2 } = await setupTrust({ adminCode: "TESTCODE2" });
    const { hospitalId: hospitalId2 } = await setupHospital({
      trustId: trustId2,
    });
    const { wardId: wardId2 } = await setupWard({
      code: "wardCode2",
      hospitalId: hospitalId2,
      trustId: trustId2,
    });

    await container.getUpdateWardVisitTotals()({
      wardId: wardId2,
      date: new Date("2020-01-01T23:00:00.000Z"),
    });

    const {
      startDate,
      error,
    } = await container.getRetrieveWardVisitTotalsStartDateByTrustId()(
      trustId1
    );

    expect(startDate).toEqual(new Date("2020-06-01T23:00:00.000Z"));
    expect(error).toBeNull();
  });

  it("returns null if there are no ward visit totals for a trust", async () => {
    const { trustId } = await setupTrust();

    const {
      startDate,
      error,
    } = await container.getRetrieveWardVisitTotalsStartDateByTrustId()(trustId);

    expect(startDate).toBeNull();
    expect(error).toBeNull();
  });

  it("returns an error if no trustId is provided", async () => {
    const {
      error,
    } = await container.getRetrieveWardVisitTotalsStartDateByTrustId()();

    expect(error).not.toBeNull();
  });
});
