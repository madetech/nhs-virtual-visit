import AppContainer from "../containers/AppContainer";
import moment from "moment";
import deleteVisitByCallId from "./deleteVisitByCallId";
import { setupTrust } from "../testUtils/factories";

describe("retrieveVisits contract tests", () => {
  const container = AppContainer.getInstance();

  it("retrieves all Visits from the db", async () => {
    const { trustId } = await setupTrust();

    const { hospitalId } = await container.getCreateHospital()({
      name: "Test Hospital",
      trustId: trustId,
    });

    const { wardId } = await container.getCreateWard()({
      name: "Test Ward",
      code: "wardCode",
      hospitalId: hospitalId,
      trustId: trustId,
    });

    const { wardId: wardId2 } = await container.getCreateWard()({
      name: "Test Ward 2",
      code: "wardCode2",
      hospitalId: hospitalId,
      trustId: trustId,
    });

    await container.getCreateVisit()({
      wardId: wardId,
      provider: "test",
      callPassword: "test",
      patientName: "past visit",
      callTime: moment().subtract(2, "hours"),
    });

    await container.getCreateVisit()({
      wardId: wardId,
      provider: "test",
      callPassword: "test",
      patientName: "future visit",
      callTime: moment().add(2, "hours"),
    });

    // Cancelled visits are not returned
    await container.getCreateVisit()({
      wardId: wardId,
      provider: "test",
      callPassword: "test",
      callId: "cancelledVisit",
      patientName: "cancelled visit",
      callTime: moment().add(2, "hours"),
    });
    await deleteVisitByCallId(container)("cancelledVisit");

    // Visits from other wards are not returned
    await container.getCreateVisit()({
      wardId: wardId2,
      provider: "test",
      callPassword: "test",
      patientName: "different ward visit",
      callTime: moment().add(2, "hours"),
    });

    const { scheduledCalls } = await container.getRetrieveVisits()({ wardId });

    expect(scheduledCalls).toEqual([
      expect.objectContaining({ patientName: "past visit" }),
      expect.objectContaining({ patientName: "future visit" }),
    ]);
  });
});
