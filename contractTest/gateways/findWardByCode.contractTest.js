import AppContainer from "../../src/containers/AppContainer";
import findWardByCode from "../../src/gateways/findWardByCode";
//import Database from "../../src/gateways/Database";
import { setupTrust, setupWard } from "../../test/testUtils/factories";

describe("findWardByCode() contract", () => {
  const container = AppContainer.getInstance();

  it("inserts visit into the db", async () => {
    //const db = await Database.getInstance();

    const wardCode = "32p+";
    const { trustId } = await setupTrust();
    const { wardId } = await setupWard({ trustId: trustId, code: wardCode });
    expect(await findWardByCode(container)(wardCode)).toEqual({
      wardCode,
      wardId,
      trustId,
    });
  });
});
