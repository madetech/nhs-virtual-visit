import AppContainer from "../containers/AppContainer";
import { setupTrust } from "../testUtils/factories";

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

    //this will sometimes come out of order but still correct causing it to fail, we should fix that, perhaps a custom matcher is needed?
    expect(trusts).toEqual([
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
