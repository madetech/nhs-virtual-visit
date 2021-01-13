import AppContainer from "../../../src/containers/AppContainer";
import Database from "../../../src/gateways/Database";

import findCallsByWardId from "../../../src/gateways/PostgreSQL/findCallsByWardId";
import updateCallStatusesByWardId from "../../../src/gateways/PostgreSQL/updateCallStatusesByWardId";
import { ARCHIVED } from "../../../src/helpers/visitStatus";

import {
  setupTrust,
  setupWard,
  setupHospital,
  setupVisit,
} from "../../../test/testUtils/factories";

describe("updateCallStatusesByWardId() contract", () => {
  const container = AppContainer.getInstance();

  it("updates the call statuses", async () => {
    await Database.getInstance();

    const { trustId } = await setupTrust();
    const { hospitalId } = await setupHospital({ trustId });
    const { wardId } = await setupWard({ trustId, hospitalId });
    await setupVisit({ wardId, callId: "ID1" });
    await setupVisit({ wardId, callId: "ID2" });
    await setupVisit({ wardId, callId: "ID3" });

    await updateCallStatusesByWardId(container)(wardId, ARCHIVED);
    const scheduledCalls = await findCallsByWardId(container)(wardId);
    expect(scheduledCalls).orderlessEqual([
      {
        wardId,
        callId: "ID1",
        status: ARCHIVED,
      },
      {
        wardId,
        callId: "ID2",
        status: ARCHIVED,
      },
      {
        wardId,
        callId: "ID3",
        status: ARCHIVED,
      },
    ]);
  });
});
