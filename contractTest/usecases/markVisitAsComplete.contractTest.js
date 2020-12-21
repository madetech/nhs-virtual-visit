import AppContainer from "../../src/containers/AppContainer";
import {
  setupWardWithinHospitalAndTrust,
  setupVisit,
} from "../../test/testUtils/factories";
import { COMPLETE } from "../../src/helpers/visitStatus";

describe("markVisitAsComplete contract tests", () => {
  const container = AppContainer.getInstance();

  it("retrieves a visit by id", async () => {
    const { wardId, trustId } = await setupWardWithinHospitalAndTrust();
    const { id } = await setupVisit({ wardId, trustId });

    const {
      id: scheduledCallId,
      error,
    } = await container.getMarkVisitAsComplete()({
      id,
      wardId,
    });

    const { scheduledCall } = await container.getRetrieveVisitById()({
      id: scheduledCallId,
      wardId,
    });

    expect(error).toBeNull();
    expect(scheduledCall).toEqual(
      expect.objectContaining({
        status: COMPLETE,
      })
    );
  });
});
