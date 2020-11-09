import AppContainer from "../containers/AppContainer";
import {
  setupTrust,
  setupVisit,
  setupWardWithinHospitalAndTrust,
} from "../testUtils/factories";
import { v4 as uuidv4 } from "uuid";
import MockDate from "mockdate";

describe("retrieveReportingStartDateByTrustId contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns the date of when reporting started for a trust", async () => {
    // A trust with 2 events
    const {
      wardId: wardId1,
      trustId: trustId1,
    } = await setupWardWithinHospitalAndTrust({
      index: 1,
    });

    const { id: visitId } = await setupVisit({
      wardId: wardId1,
      callId: "callId1",
    });

    const callSessionId = uuidv4();

    MockDate.set(new Date("2020-06-01 13:00"));

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId,
      callSessionId,
    });

    const { id: visitId2 } = await setupVisit({
      wardId: wardId1,
      callId: "callId2",
    });

    const callSessionId2 = uuidv4();

    MockDate.set(new Date("2020-06-15 13:00"));

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId: visitId2,
      callSessionId: callSessionId2,
    });

    // Another trust with 1 event
    const { wardId: wardId2 } = await setupWardWithinHospitalAndTrust({
      index: 2,
    });

    const { id: visitId3 } = await setupVisit({
      wardId: wardId2,
      callId: "callId3",
    });

    const callSessionId3 = uuidv4();

    MockDate.set(new Date("2020-06-01 13:00"));

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId: visitId3,
      callSessionId: callSessionId3,
    });

    const {
      startDate,
      error,
    } = await container.getRetrieveReportingStartDateByTrustId()(trustId1);

    expect(startDate).toEqual("1 June 2020");
    expect(error).toBeNull();
  });

  it("returns null if there are no events for a trust", async () => {
    const { trustId } = await setupTrust();

    const {
      startDate,
      error,
    } = await container.getRetrieveReportingStartDateByTrustId()(trustId);

    expect(startDate).toBeNull();
    expect(error).toBeNull();
  });

  it("returns an error if no trustId is provided", async () => {
    const {
      error,
    } = await container.getRetrieveReportingStartDateByTrustId()();

    expect(error).not.toBeNull();
  });
});
