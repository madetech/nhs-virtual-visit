import AppContainer from "../../../src/containers/AppContainer";
import { setupTrust, setupWard } from "../../../test/testUtils/factories";

describe.skip("updateWardVisitTotals contract tests", () => {
  const container = AppContainer.getInstance();
  const dateToInsert = "2020-05-05T10:10:10";

  it("inserts a new value for the ward and date when no value currently exists", async () => {
    const db = await container.getDb();

    const { trustId } = await setupTrust();
    const { wardId } = await setupWard({ trustId: trustId });

    await container.getUpdateWardVisitTotalsGateway()(db, wardId, dateToInsert);

    const { total } = await container.getRetrieveWardVisitTotals()(trustId);
    expect(total).toEqual(1);
  });

  it("updates the existing value for the ward", async () => {
    const db = await container.getDb();

    const { trustId } = await setupTrust();
    const { wardId } = await setupWard({ trustId: trustId });

    await container.getUpdateWardVisitTotalsGateway()(db, wardId, dateToInsert);
    await container.getUpdateWardVisitTotalsGateway()(db, wardId, dateToInsert);

    const { total } = await container.getRetrieveWardVisitTotals()(trustId);
    expect(total).toEqual(2);
  });
});
