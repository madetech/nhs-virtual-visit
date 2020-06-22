import createTrust from "./createTrust";
import AppContainer from "../containers/AppContainer";

describe("createTrust contract tests", () => {
  const container = AppContainer.getInstance();
  const retrieveTrustById = container.getRetrieveTrustById();

  it("creates a trust in the db when valid", async () => {
    const request = {
      name: "Defoe Trust",
      adminCode: "adminCode",
      password: "trustpassword",
      videoProvider: "provider",
    };

    const { trustId, error } = await createTrust(container)(request);

    const { trust } = await retrieveTrustById(trustId);

    expect(trust).toEqual({
      id: trustId,
      name: request.name,
      videoProvider: "provider",
    });

    expect(error).toBeNull();
  });

  it("returns an error if the admin_code is not unique", async () => {
    await createTrust(container)({
      name: "Test Trust",
      adminCode: "adminCode",
      password: "trustpassword",
      videoProvider: "provider",
    });

    const request = {
      name: "Test Trust 2",
      adminCode: "adminCode",
      password: "trustpassword",
      videoProvider: "provider",
    };

    const { trustId, error } = await createTrust(container)(request);

    expect(trustId).toBeNull();
    expect(error.toString()).toEqual(
      'error: duplicate key value violates unique constraint "trusts_admin_code_key"'
    );
  });

  it("returns an error if the video provider is not present", async () => {
    const { trustId, error } = await createTrust(container)({
      name: "Test Trust 2",
      adminCode: "adminCode",
      password: "trustpassword",
    });

    expect(trustId).toBeNull();
    expect(error.toString()).toEqual(
      'error: null value in column "video_provider" violates not-null constraint'
    );
  });
});
