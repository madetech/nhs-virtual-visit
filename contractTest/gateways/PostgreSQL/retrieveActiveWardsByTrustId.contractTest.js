import AppContainer from "../../../src/containers/AppContainer";
import retrieveActiveWardsByTrustId from "../../../src/gateways/PostgreSQL/retrieveActiveWardsByTrustId";

import {
  setupTrust,
  setupWard,
  setupHospital,
} from "../../../test/testUtils/factories";

describe("retrieveActiveWardsByTrustId() contract", () => {
  const container = AppContainer.getInstance();

  it("returns the appropriate ward", async () => {
    const { trustId: trustIdA } = await setupTrust();
    const hospitalNameA = "hospital A";
    const { hospitalId: hospitalIdA } = await setupHospital({
      trustId: trustIdA,
      name: hospitalNameA,
    });
    const wardCodeA = "A";
    const wardNameA = "Ward A";
    const { wardId: wardIdA } = await setupWard({
      trustId: trustIdA,
      code: wardCodeA,
      name: wardNameA,
      hospitalId: hospitalIdA,
    });

    const hospitalNameB = "hospital B";
    const { hospitalId: hospitalIdB } = await setupHospital({
      trustId: trustIdA,
      name: hospitalNameB,
    });
    const wardCodeB = "B";
    const wardNameB = "Ward B";
    const { wardId: wardIdB } = await setupWard({
      trustId: trustIdA,
      code: wardCodeB,
      name: wardNameB,
      hospitalId: hospitalIdB,
    });

    const { trustId: trustIdB } = await setupTrust();
    const hospitalNameC = "hospital C";
    const { hospitalId: hospitalIdC } = await setupHospital({
      trustId: trustIdB,
      name: hospitalNameC,
    });
    const wardCodeC = "C";
    const wardNameC = "Ward C";
    await setupWard({
      trustId: trustIdB,
      code: wardCodeC,
      name: wardNameC,
      hospitalId: hospitalIdC,
    });

    const results = await retrieveActiveWardsByTrustId(container)(trustIdA);
    expect(results).orderlessEqual([
      {
        wardId: wardIdA,
        wardName: wardNameA,
        wardCode: wardCodeA,
        hospitalName: hospitalNameA,
      },
      {
        wardId: wardIdB,
        wardName: wardNameB,
        wardCode: wardCodeB,
        hospitalName: hospitalNameB,
      },
    ]);
  });
});
