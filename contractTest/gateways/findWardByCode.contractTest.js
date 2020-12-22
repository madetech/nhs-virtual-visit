import AppContainer from "../../src/containers/AppContainer";
import findWardByCode from "../../src/gateways/findWardByCode";
//import Database from "../../src/gateways/Database";
import {
  setupTrust,
  setupWard,
  setupHospital,
} from "../../test/testUtils/factories";

describe("findWardByCode() contract", () => {
  const container = AppContainer.getInstance();

  it("inserts visit into the db", async () => {
    //const db = await Database.getInstance();

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
    });
  });
});
