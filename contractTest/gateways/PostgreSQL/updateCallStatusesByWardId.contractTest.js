import AppContainer from "../../../src/containers/AppContainer";
import Database from "../../../src/gateways/Database";

import findCallsByWardId from "../../../src/gateways/PostgreSQL/findCallsByWardId";
import updateCallStatusesByWardId from "../../../src/gateways/PostgreSQL/updateCallStatusesByWardId";
import { ARCHIVED } from "../../../src/helpers/visitStatus";

import {
  setupTrust,
  setupWard,
  setupHospital,
  setupVisitPostgres,
} from "../../../test/testUtils/factories";

describe.skip("updateCallStatusesByWardId() contract", () => {
  const container = AppContainer.getInstance();

  it("updates the call statuses", async () => {
    await Database.getInstance();

    const { trustId } = await setupTrust();
    const { hospitalId } = await setupHospital({ trustId });
    const { wardId } = await setupWard({ trustId, hospitalId });
    await setupVisitPostgres({ wardId, callId: "ID1" });
    await setupVisitPostgres({ wardId, callId: "ID2" });
    await setupVisitPostgres({ wardId, callId: "ID3" });

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
