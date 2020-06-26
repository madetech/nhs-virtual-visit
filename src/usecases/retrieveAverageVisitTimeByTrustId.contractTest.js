import AppContainer from "../containers/AppContainer";
import {
  setupTrust,
  setupHospital,
  setupWard,
  setupVisit,
} from "../testUtils/factories";
import { v4 as uuidv4 } from "uuid";
import MockDate from "mockdate";

describe("retrieveAverageVisitTimeByTrustId contract tests", () => {
  const container = AppContainer.getInstance();

  let trustId;
  let hospitalId;
  let wardId;

  beforeEach(async () => {
    const trust = await setupTrust();
    trustId = trust.trustId;

    const hospital = await setupHospital({ trustId });
    hospitalId = hospital.hospitalId;

    const ward = await setupWard({
      hospitalId: hospitalId,
      trustId: trustId,
    });
    wardId = ward.wardId;
  });

  it("returns the average visit time for a Trust", async () => {
    // A trust with a visit with 1 participant
    const { id: visitId } = await setupVisit({
      wardId: wardId,
    });

    const sessionId = uuidv4();

    MockDate.set(new Date("2020-06-01 13:00"));

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId,
      sessionId,
    });

    MockDate.set(new Date("2020-06-01 14:30"));

    await container.getCaptureEvent()({
      action: "leave-visit",
      visitId: visitId,
      sessionId,
    });

    const { id: visit2Id } = await setupVisit({
      wardId: wardId,
      callId: "TESTCALLID2",
    });

    const session2Id = uuidv4();

    MockDate.set(new Date("2020-06-01 12:00"));

    const { error: error1 } = await container.getCaptureEvent()({
      action: "join-visit",
      visitId: visit2Id,
      sessionId: session2Id,
    });

    expect(error1).toBeNull();
    MockDate.set(new Date("2020-06-01 13:20"));

    const { error: error2 } = await container.getCaptureEvent()({
      action: "leave-visit",
      visitId: visit2Id,
      sessionId: session2Id,
    });

    expect(error2).toBeNull();

    // (90 + 80) minutes / 2 = 5100 seconds
    const {
      averageVisitTimeSeconds,
      error,
    } = await container.getRetrieveAverageVisitTimeByTrustId()(trustId);

    expect(averageVisitTimeSeconds).toEqual(5100);
    expect(error).toBeNull();
  });

  it("returns 0 when there are no events", async () => {
    const {
      averageVisitTimeSeconds,
      error,
    } = await container.getRetrieveAverageVisitTimeByTrustId()(trustId);

    expect(averageVisitTimeSeconds).toEqual(0);
    expect(error).toBeNull();
  });

  it("returns 0 if there is only 1 event for a trust", async () => {
    // A trust with a visit with 1 participant
    const { id: visitId } = await setupVisit({
      wardId: wardId,
    });

    const sessionId = uuidv4();

    MockDate.set(new Date("2020-06-01 13:00"));

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId,
      sessionId,
    });

    const {
      averageVisitTimeSeconds,
      error,
    } = await container.getRetrieveAverageVisitTimeByTrustId()(trustId);

    expect(averageVisitTimeSeconds).toEqual(0);
    expect(error).toBeNull();
  });

  it("returns 0 if there are only join events", async () => {
    // A trust with a visit with 1 participant
    const { id: visitId } = await setupVisit({
      wardId: wardId,
    });

    MockDate.set(new Date("2020-06-01 13:00"));

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId,
      sessionId: uuidv4(),
    });

    MockDate.set(new Date("2020-06-01 13:10"));

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId,
      sessionId: uuidv4(),
    });

    const {
      averageVisitTimeSeconds,
      error,
    } = await container.getRetrieveAverageVisitTimeByTrustId()(trustId);

    expect(averageVisitTimeSeconds).toEqual(0);
    expect(error).toBeNull();
  });

  it("ignores visits with 0 duration when calculating the average", async () => {
    // A trust with a visit with 1 participant
    const { id: visitId } = await setupVisit({
      wardId: wardId,
    });

    const sessionId = uuidv4();

    MockDate.set(new Date("2020-06-01 13:00"));

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId,
      sessionId,
    });

    MockDate.set(new Date("2020-06-01 14:30"));

    await container.getCaptureEvent()({
      action: "leave-visit",
      visitId: visitId,
      sessionId,
    });

    const { id: visit2Id } = await setupVisit({
      wardId: wardId,
      callId: "TESTCALLID2",
    });

    const session2Id = uuidv4();

    MockDate.set(new Date("2020-06-01 12:00"));

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId: visit2Id,
      sessionId: session2Id,
    });

    const {
      averageVisitTimeSeconds,
      error,
    } = await container.getRetrieveAverageVisitTimeByTrustId()(trustId);

    expect(averageVisitTimeSeconds).toEqual(5400);
    expect(error).toBeNull();
  });

  it("returns an error if no trustId is provided", async () => {
    const { error } = await container.getRetrieveAverageVisitTimeByTrustId()();

    expect(error).not.toBeNull();
  });
});
