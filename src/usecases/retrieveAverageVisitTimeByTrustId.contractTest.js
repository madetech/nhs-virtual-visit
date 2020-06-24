import AppContainer from "../containers/AppContainer";
import { setupTrust } from "../testUtils/factories";
import { v4 as uuidv4 } from "uuid";
import MockDate from "mockdate";

describe("retrieveAverageVisitTimeByTrustId contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns the average visit time for a Trust", async () => {
    // A trust with a visit with 1 participant
    const { trustId } = await setupTrust();

    const { hospitalId } = await container.getCreateHospital()({
      name: "Test Hospital",
      trustId: trustId,
    });

    const { wardId } = await container.getCreateWard()({
      name: "Test Ward 1",
      code: "wardCode1",
      hospitalId: hospitalId,
      trustId: trustId,
    });

    const { id: visitId } = await container.getCreateVisit()({
      patientName: "Glimmer",
      contactEmail: "bow@example.com",
      contactName: "Bow",
      callTime: new Date("2020-06-01 13:00"),
      callId: "testCallId",
      provider: "TESTPROVIDER",
      wardId: wardId,
      callPassword: "testCallPassword",
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

    const { id: visit2Id } = await container.getCreateVisit()({
      patientName: "Glimmer",
      contactEmail: "bow@example.com",
      contactName: "Bow",
      callTime: new Date("2020-06-01 12:00"),
      callId: "testCallId2",
      provider: "TESTPROVIDER",
      wardId: wardId,
      callPassword: "testCallPassword",
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
    // A trust with a visit with 1 participant
    const { trustId } = await setupTrust();

    const {
      averageVisitTimeSeconds,
      error,
    } = await container.getRetrieveAverageVisitTimeByTrustId()(trustId);

    expect(averageVisitTimeSeconds).toEqual(0);
    expect(error).toBeNull();
  });

  it("returns 0 if there is only 1 event for a trust", async () => {
    // A trust with a visit with 1 participant
    const { trustId } = await setupTrust();

    const { hospitalId } = await container.getCreateHospital()({
      name: "Test Hospital",
      trustId: trustId,
    });

    const { wardId } = await container.getCreateWard()({
      name: "Test Ward 1",
      code: "wardCode1",
      hospitalId: hospitalId,
      trustId: trustId,
    });

    const { id: visitId } = await container.getCreateVisit()({
      patientName: "Glimmer",
      contactEmail: "bow@example.com",
      contactName: "Bow",
      callTime: new Date("2020-06-01 13:00"),
      callId: "testCallId",
      provider: "TESTPROVIDER",
      wardId: wardId,
      callPassword: "testCallPassword",
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
    const { trustId } = await setupTrust();

    const { hospitalId } = await container.getCreateHospital()({
      name: "Test Hospital",
      trustId: trustId,
    });

    const { wardId } = await container.getCreateWard()({
      name: "Test Ward 1",
      code: "wardCode1",
      hospitalId: hospitalId,
      trustId: trustId,
    });

    const { id: visitId } = await container.getCreateVisit()({
      patientName: "Glimmer",
      contactEmail: "bow@example.com",
      contactName: "Bow",
      callTime: new Date("2020-06-01 13:00"),
      callId: "testCallId",
      provider: "TESTPROVIDER",
      wardId: wardId,
      callPassword: "testCallPassword",
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
    const { trustId } = await setupTrust();

    const { hospitalId } = await container.getCreateHospital()({
      name: "Test Hospital",
      trustId: trustId,
    });

    const { wardId } = await container.getCreateWard()({
      name: "Test Ward 1",
      code: "wardCode1",
      hospitalId: hospitalId,
      trustId: trustId,
    });

    const { id: visitId } = await container.getCreateVisit()({
      patientName: "Glimmer",
      contactEmail: "bow@example.com",
      contactName: "Bow",
      callTime: new Date("2020-06-01 13:00"),
      callId: "testCallId",
      provider: "TESTPROVIDER",
      wardId: wardId,
      callPassword: "testCallPassword",
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

    const { id: visit2Id } = await container.getCreateVisit()({
      patientName: "Glimmer",
      contactEmail: "bow@example.com",
      contactName: "Bow",
      callTime: new Date("2020-06-01 12:00"),
      callId: "testCallId2",
      provider: "TESTPROVIDER",
      wardId: wardId,
      callPassword: "testCallPassword",
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
