import verifyAdminCodeGateway from "../../../src/gateways/MsSQL/verifyAdminCode";
import AppContainer from "../../../src/containers/AppContainer";
import setupAdmin from "../../../test/testUtils/setupAdmin";

describe("verifyAdminCode contract tests", () => {
  const container = AppContainer.getInstance();
  let randInt;

  beforeEach(async () => {
    randInt = Math.round(Math.random() * 100);
    await setupAdmin(container)({
      email: `nhs-admin${randInt}@nhs.co.uk`,
      password: "password",
      type: "admin",
    });
  });
  it("verifies user if they are an admin", async () => {
    const { validAdminCode, error } = await verifyAdminCodeGateway(container)(
      `nhs-admin${randInt}@nhs.co.uk`,
      "password"
    );
    expect(error).toBeNull();
    expect(validAdminCode).toBe(true);
  });

  it("is not valid if the password is wrong", async () => {
    const { validAdminCode, error } = await verifyAdminCodeGateway(container)(
      `nhs-admin${randInt}@nhs.co.uk`,
      "incorrect password"
    );
    expect(error).toEqual("Incorrect email or password");
    expect(validAdminCode).toBe(false);
  });

  it("is not valid if user is not an admin", async () => {
    await setupAdmin(container)({
      email: `nhs-manager${randInt}@nhs.co.uk`,
      password: "password",
      type: "manager",
    });
    const { validAdminCode, error } = await verifyAdminCodeGateway(container)(
      `nhs-manager${randInt}@nhs.co.uk`,
      "password"
    );
    expect(error).toEqual("You are not an admin");
    expect(validAdminCode).toBe(false);
  });

  it("is not valid if the email isn't in the database", async () => {
    const { validAdminCode, error } = await verifyAdminCodeGateway(container)(
      "wrongemail@email.com",
      "password"
    );
    expect(error).toEqual("There was an error verifying admin");
    expect(validAdminCode).toBe(false);
  });
});
