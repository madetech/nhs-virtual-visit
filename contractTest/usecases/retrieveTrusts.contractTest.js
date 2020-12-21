import AppContainer from "../../src/containers/AppContainer";
import { setupTrust } from "../../test/testUtils/factories";

describe("retrieveTrusts contract tests", () => {
  const container = AppContainer.getInstance();

  it("retrieves all Trusts from the db", async () => {
    const { trustId: trustId1 } = await setupTrust({
      name: "Test Trust",
      adminCode: "code1",
    });
    const { trustId: trustId2 } = await setupTrust({
      name: "Test Trust 2",
      adminCode: "code2",
    });

    const { trusts } = await container.getRetrieveTrusts()();

    expect(trusts).orderlessEqual([
      {
        id: trustId1,
        name: "Test Trust",
        adminCode: "code1",
        videoProvider: "whereby",
      },
      {
        id: trustId2,
        name: "Test Trust 2",
        adminCode: "code2",
        videoProvider: "whereby",
      },
    ]);
  });
});
