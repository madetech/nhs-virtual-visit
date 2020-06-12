import verifyTrustAdminCode from "./verifyTrustAdminCode";
import AppContainer from "../containers/AppContainer";

describe("verifyTrustAdminCode contract tests", () => {
  const container = AppContainer.getInstance();

  it("verifies if a admin code and password match an existing trust", async () => {
    const { trustId } = await container.getCreateTrust()({
      name: "Test Trust",
      adminCode: "TESTCODE",
      password: "TESTPASSWORD",
    });

    const { validTrustAdminCode, trust, error } = await verifyTrustAdminCode(
      container
    )("TESTCODE", "TESTPASSWORD");

    expect(validTrustAdminCode).toEqual(true);
    expect(trust).toEqual({ id: trustId });
    expect(error).toBeNull;
  });

  it("is not valid if the password is not provided", async () => {
    await container.getCreateTrust()({
      name: "Test Trust",
      adminCode: "TESTCODE",
      password: "TESTPASSWORD",
    });

    const { validTrustAdminCode, trust, error } = await verifyTrustAdminCode(
      container
    )("TESTCODE");

    expect(validTrustAdminCode).toEqual(false);
    expect(trust).toBeNull;
    expect(error).toBeNull;
  });

  it("is not valid if the code is incorrect", async () => {
    await container.getCreateTrust()({
      name: "Test Trust",
      adminCode: "TESTCODE",
      password: "TESTPASSWORD",
    });

    const { validTrustAdminCode, trust, error } = await verifyTrustAdminCode(
      container
    )("WRONGCODE", "TESTPASSWORD");

    expect(validTrustAdminCode).toEqual(false);
    expect(trust).toBeNull;
    expect(error).toBeNull;
  });

  it("is not valid if the password is incorrect", async () => {
    await container.getCreateTrust()({
      name: "Test Trust",
      adminCode: "TESTCODE",
      password: "TESTPASSWORD",
    });

    const { validTrustAdminCode, trust, error } = await verifyTrustAdminCode(
      container
    )("TESTCODE", "WRONGPASSWORD");

    expect(validTrustAdminCode).toEqual(false);
    expect(trust).toBeNull;
    expect(error).toBeNull;
  });
});
