import AppContainer from "../../../src/containers/AppContainer";
import findWardByCode from "../../../src/gateways/PostgreSQL/findWardByCode";

import {
  setupTrust,
  setupWard,
  setupHospital,
} from "../../../test/testUtils/factories";

describe("findWardByCode() contract", () => {
  const container = AppContainer.getInstance();

  it("returns the appropriate ward", async () => {
    const wardCode = "32p+";
    const wardName = "Deutsche ward";
    const { trustId } = await setupTrust();
    const { hospitalId } = await setupHospital({ trustId });
    const { wardId } = await setupWard({
      trustId,
      code: wardCode,
      name: wardName,
      hospital_id: hospitalId,
    });

    expect(await findWardByCode(container)(wardCode)).toEqual({
      wardCode,
      wardId,
      trustId,
      archivedAt: null,
    });
  });

  it("returns null when the ward code can't be found", async () => {
    const wardCode = "32p+";
    const wardName = "Deutsche ward";
    const { trustId } = await setupTrust();
    const { hospitalId } = await setupHospital({ trustId });
    await setupWard({
      trustId,
      code: wardCode,
      name: wardName,
      hospital_id: hospitalId,
    });

    expect(await findWardByCode(container)("14p+")).toBeNull();
  });
});
