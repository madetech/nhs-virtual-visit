import moment from "moment";

import AppContainer from "../../../src/containers/AppContainer";
import Database from "../../../src/gateways/Database";

import findWardByCode from "../../../src/gateways/PostGreSQL/findWardByCode";
import updateWardArchiveTimeById from "../../../src/gateways/PostGreSQL/updateWardArchiveTimeById";

import {
  setupTrust,
  setupWard,
  setupHospital,
} from "../../../test/testUtils/factories";

describe("updateWardArchiveTimeById() contract", () => {
  const container = AppContainer.getInstance();

  it("updates the call statuses", async () => {
    await Database.getInstance();

    const wardCode = "TestWard";
    const { trustId } = await setupTrust();
    const { hospitalId } = await setupHospital({ trustId });
    const { wardId } = await setupWard({ trustId, hospitalId, code: wardCode });

    const archivedAt = moment("1986-04-05").toISOString();
    await updateWardArchiveTimeById(container)(wardId, archivedAt);
    const ward = await findWardByCode(container)(wardCode);
    expect(ward).toEqual({
      wardCode,
      wardId,
      trustId,
      archivedAt,
    });
  });
});
