import archiveWard from "./archiveWard";
import retrieveWardById from "./retrieveWardById";
import AppContainer from "../containers/AppContainer";
import retrieveVisits from "./retrieveVisits";
import {
  setupWardWithinHospitalAndTrust,
  setupVisit,
} from "../testUtils/factories";

describe("archiveWard contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns an error when the ward data is invalid", async () => {
    const { success, error } = await archiveWard(container)(99, 99);

    expect(error).toBe("Ward does not exist");
    expect(success).toBeFalsy();
  });

  it("archives the ward when the ward data is valid", async () => {
    const { trustId, wardId } = await setupWardWithinHospitalAndTrust();

    const {
      ward: preArchiveWard,
      error: preArchiveWardError,
    } = await retrieveWardById(container)(wardId, trustId);

    expect(preArchiveWardError).toBeNull();
    expect(preArchiveWard).toBeDefined();

    const { success, error: archiveError } = await archiveWard(container)(
      wardId,
      trustId
    );

    expect(archiveError).toBeNull();
    expect(success).toBeTruthy();

    // ward should not be found by this use case as it's been archived
    const {
      ward: postArchiveWard,
      error: postArchiveWardError,
    } = await retrieveWardById(container)(wardId, trustId);

    expect(postArchiveWardError).toBeDefined();
    expect(postArchiveWard).toBeNull();
  });

  it("archives ward visits when the ward data is valid and visits are scheduled", async () => {
    const { trustId, wardId } = await setupWardWithinHospitalAndTrust();

    const { id: visitId } = await setupVisit({ wardId });

    expect(visitId).toBeDefined();

    const {
      scheduledCalls: preArchiveScheduledCalls,
      error: preArchiveVisitError,
    } = await retrieveVisits(container)({ wardId: wardId });

    expect(preArchiveVisitError).toBeNull();
    expect(
      preArchiveScheduledCalls.find((visit) => visit.id === visitId)
    ).toBeDefined();

    const { success, error } = await archiveWard(container)(wardId, trustId);

    expect(error).toBeNull();
    expect(success).toBeTruthy();

    const {
      scheduledCalls: postArchiveScheduledCalls,
      error: postArchiveVisitError,
    } = await retrieveVisits(container)(wardId);

    expect(postArchiveVisitError).toBeNull();
    expect(postArchiveScheduledCalls.length).toBe(0);
  });
});
