import archiveWard from "./archiveWard";
import retrieveWardById from "./retrieveWardById";
import AppContainer from "../containers/AppContainer";
import retrieveVisits from "./retrieveVisits";

describe("archiveWard contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns an error when the ward data is invalid", async () => {
    const { success, error } = await archiveWard(container)(99, 99);

    expect(error).toBe("Ward does not exist");
    expect(success).toBeFalsy();
  });

  it("archives the ward when the ward data is valid", async () => {
    const { trustId } = await container.getCreateTrust()({
      name: "Test Trust",
      adminCode: "TEST",
    });

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
    const { trustId } = await container.getCreateTrust()({
      name: "Test Trust",
      adminCode: "TEST",
    });

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
      patientName: "Bob Smith",
      contactEmail: "bob.smith@madetech.com",
      contactName: "John Smith",
      contactNumber: "07123456789",
      callTime: new Date(),
      callId: 12345,
      provider: "jitsi",
      wardId: wardId,
      callPassword: "securePassword",
    });

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
