import AppContainer from "../containers/AppContainer";

describe("retrieveTrusts contract tests", () => {
  const container = AppContainer.getInstance();

  it("retrieves all Trusts from the db", async () => {
    const { trustId: trustId1 } = await container.getCreateTrust()({
      name: "Test Trust",
      adminCode: "code1",
    });

    const { trustId: trustId2 } = await container.getCreateTrust()({
      name: "Test Trust 2",
      adminCode: "code2",
    });

    const { trusts } = await container.getRetrieveTrusts()();

    expect(trusts).toEqual([
      { id: trustId1, name: "Test Trust", adminCode: "code1" },
      { id: trustId2, name: "Test Trust 2", adminCode: "code2" },
    ]);
  });
});
