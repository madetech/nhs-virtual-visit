import AppContainer from "../containers/AppContainer";
import {
  setupWardWithinHospitalAndTrust,
  setupWard,
  setupHospital,
  setupTrust,
  setupVisit,
} from "../testUtils/factories";
import { v4 as uuidv4 } from "uuid";

describe("retrieveAverageVisitsPerDay contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns the average number of visits per day for a trust", async () => {
    // A trust with a visit with 1 participant
    const { trustId, wardId } = await setupWardWithinHospitalAndTrust();

    const { id: visitId } = await setupVisit({ wardId });

    const callSessionId = uuidv4();

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId,
      callSessionId,
    });

    await container.getCaptureEvent()({
      action: "leave-visit",
      visitId,
      callSessionId,
    });

    // A trust with a visit with 1 participant, one with 2 participants and
    // another with 1 participant
    const { hospitalId: hospitalId2 } = await setupHospital({
      name: "Test Hospital 2",
      trustId,
    });

    const { wardId: wardId2 } = await setupWard({
      name: "Test Ward 2",
      code: "wardCode2",
      hospitalId: hospitalId2,
      trustId,
    });

    const { id: visitId2 } = await setupVisit({
      wardId: wardId2,
      callId: "testCallId2",
    });

    const callSessionId2 = uuidv4();

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId: visitId2,
      callSessionId: callSessionId2,
    });

    await container.getCaptureEvent()({
      action: "leave-visit",
      visitId: visitId2,
      callSessionId: callSessionId2,
    });

    const { id: visitId3 } = await setupVisit({
      wardId: wardId2,
      callId: "testCallId3",
    });

    const callSessionId3 = uuidv4();

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId: visitId3,
      callSessionId: callSessionId3,
    });

    await container.getCaptureEvent()({
      action: "leave-visit",
      visitId: visitId3,
      callSessionId: callSessionId3,
    });

    const callSessionId4 = uuidv4();

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId: visitId3,
      callSessionId: callSessionId4,
    });

    await container.getCaptureEvent()({
      action: "leave-visit",
      visitId: visitId3,
      callSessionId: callSessionId4,
    });

    // Has no events so shouldn't be counted
    await setupVisit({ wardId: wardId2, callId: "testCallId4" });

    const {
      averageVisitsPerDay,
      error,
    } = await container.getRetrieveAverageVisitsPerDayByTrustId()(
      trustId,
      new Date("2020-06-03 13:00")
    );

    expect(averageVisitsPerDay).toEqual(1);
    expect(error).toBeNull();
  });

  it("returns 0 if there are no events for a trust", async () => {
    const { trustId } = await setupTrust();

    const {
      averageVisitsPerDay,
      error,
    } = await container.getRetrieveAverageVisitsPerDayByTrustId()(trustId);

    expect(averageVisitsPerDay).toEqual(0);
    expect(error).toBeNull();
  });

  it("returns an error if no trustId is provided", async () => {
    const {
      error,
    } = await container.getRetrieveAverageVisitsPerDayByTrustId()();

    expect(error).not.toBeNull();
  });
});
