import AppContainer from "../../src/containers/AppContainer";
import {
  setupTrust,
  setupHospital,
  setupWard,
  setupVisitPostgres,
} from "../../test/testUtils/factories";
import { v4 as uuidv4 } from "uuid";
import MockDate from "mockdate";

describe.skip("retrieveAverageVisitTimeByTrustId contract tests", () => {
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
    //This previously didn't validate anything so this test would
    //erroneously pass, however the validation has been placed inside it so
    //it does now require that things validate
    //a fair number of issues with setupVisit() have been sorted thus far
    //how ever we're still passing strange values like TESTPROVIDER that
    //the program doesn't know how to deal with, we'll probably need to give
    //it a real value
    const { id: visitId } = await setupVisitPostgres({
      trustId: trustId,
      wardId: wardId,
    });

    const callSessionId = uuidv4();

    MockDate.set(new Date("2020-06-01 13:00"));

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId,
      callSessionId,
    });

    MockDate.set(new Date("2020-06-01 14:30"));

    await container.getCaptureEvent()({
      action: "leave-visit",
      visitId: visitId,
      callSessionId,
    });

    const { id: visit2Id } = await setupVisitPostgres({
      wardId: wardId,
      callId: "TESTCALLID2",
    });

    const callSession2Id = uuidv4();

    MockDate.set(new Date("2020-06-01 12:00"));

    const { error: error1 } = await container.getCaptureEvent()({
      action: "join-visit",
      visitId: visit2Id,
      callSessionId: callSession2Id,
    });

    expect(error1).toBeNull();
    MockDate.set(new Date("2020-06-01 13:20"));

    const { error: error2 } = await container.getCaptureEvent()({
      action: "leave-visit",
      visitId: visit2Id,
      callSessionId: callSession2Id,
    });

    expect(error2).toBeNull();

    const {
      averageVisitTime,
      error,
    } = await container.getRetrieveAverageVisitTimeByTrustId()(trustId);

    // (90 + 80) minutes / 2 = 1 hr, 25 mins
    expect(averageVisitTime).toEqual("1 hr, 25 mins");
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
    const { id: visitId } = await setupVisitPostgres({
      wardId: wardId,
    });

    const callSessionId = uuidv4();

    MockDate.set(new Date("2020-06-01 13:00"));

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId,
      callSessionId,
    });

    const {
      averageVisitTime,
      error,
    } = await container.getRetrieveAverageVisitTimeByTrustId()(trustId);

    expect(averageVisitTime).toEqual("0 mins");
    expect(error).toBeNull();
  });

  it("returns 0 if there are only join events", async () => {
    // A trust with a visit with 1 participant
    const { id: visitId } = await setupVisitPostgres({
      wardId: wardId,
    });

    MockDate.set(new Date("2020-06-01 13:00"));

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId,
      callSessionId: uuidv4(),
    });

    MockDate.set(new Date("2020-06-01 13:10"));

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId,
      callSessionId: uuidv4(),
    });

    const {
      averageVisitTime,
      error,
    } = await container.getRetrieveAverageVisitTimeByTrustId()(trustId);

    expect(averageVisitTime).toEqual("0 mins");
    expect(error).toBeNull();
  });

  it("ignores visits with 0 duration when calculating the average", async () => {
    // A trust with a visit with 1 participant
    const { id: visitId } = await setupVisitPostgres({
      wardId: wardId,
    });

    const callSessionId = uuidv4();

    MockDate.set(new Date("2020-06-01 13:00"));

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId,
      callSessionId,
    });

    MockDate.set(new Date("2020-06-01 14:30"));

    await container.getCaptureEvent()({
      action: "leave-visit",
      visitId: visitId,
      callSessionId,
    });

    const { id: visit2Id } = await setupVisitPostgres({
      wardId: wardId,
      callId: "TESTCALLID2",
    });

    const callSessionId2 = uuidv4();

    MockDate.set(new Date("2020-06-01 12:00"));

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId: visit2Id,
      callSessionId: callSessionId2,
    });

    const {
      averageVisitTime,
      error,
    } = await container.getRetrieveAverageVisitTimeByTrustId()(trustId);

    expect(averageVisitTime).toEqual("1 hr, 30 mins");
    expect(error).toBeNull();
  });

  it("returns an error if no trustId is provided", async () => {
    const { error } = await container.getRetrieveAverageVisitTimeByTrustId()();

    expect(error).not.toBeNull();
  });
});
