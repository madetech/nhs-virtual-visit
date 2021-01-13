import AppContainer from "../../src/containers/AppContainer";

describe("createTrust contract tests", () => {
  const container = AppContainer.getInstance();

  it("creates a trust in the db when valid", async () => {
    const request = {
      name: "Defoe Trust",
      adminCode: "adminCode",
      password: "trustpassword",
      videoProvider: "provider",
    };

    const { trustId, error } = await container.getCreateTrust()(request);

    const { trust } = await container.getRetrieveTrustById()(trustId);

    expect(trust).toEqual({
      id: trustId,
      name: request.name,
      videoProvider: "provider",
    });

    expect(error).toBeNull();
  });

  it("returns an error if the admin_code is not unique", async () => {
    const request = {
      name: "Defoe Trust",
      adminCode: "adminCode",
      password: "trustpassword",
      videoProvider: "provider",
    };

    await container.getCreateTrust()(request);

    const { trustId, error } = await container.getCreateTrust()(request);

    expect(trustId).toBeNull();
    expect(error.toString()).toEqual(
      'error: duplicate key value violates unique constraint "trusts_admin_code_key"'
    );
  });

  it("returns an error if the video provider is not present", async () => {
    const { trustId, error } = await container.getCreateTrust()({
      videoProvider: null,
      password: "trustpassword",
      name: "Defoe Trust",
      adminCode: "adminCode",
    });

    expect(trustId).toBeNull();
    expect(error.toString()).toEqual(
      'error: null value in column "video_provider" violates not-null constraint'
    );
  });
});
