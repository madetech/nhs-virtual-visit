import verifyUserLoginGateway from "../../../src/gateways/MsSQL/verifyUserLogin";
import AppContainer from "../../../src/containers/AppContainer";
import { setUpManager } from "../../../test/testUtils/factories";

describe("verifyUserLogin contract tests", () => {
  const container = AppContainer.getInstance();

  it("verifies that an admin is in the database with a valid email and password", async () => {
    const { user } = await setUpManager({
      email: "test-admin@email.com",
      password: "TESTPASSWORD",
      type: "admin",
    });

    const {
      validUser,
      trust_id,
      type,
      user_id,
      error,
    } = await verifyUserLoginGateway(container)(
      "test-admin@email.com",
      "TESTPASSWORD"
    );

    expect(validUser).toEqual(true);
    expect(trust_id).toBeNull();
    expect(user_id).toEqual(user.id);
    expect(type).toEqual("admin");
    expect(error).toBeNull();
  });

  it("verifies that a manager is in the database with a valid email and password", async () => {
    const { user } = await setUpManager({
      email: "test-manager@email.com",
      password: "TESTPASSWORD",
      type: "manager",
      organisation_id: 1,
    });

    const {
      validUser,
      trust_id,
      type,
      user_id,
      error,
    } = await verifyUserLoginGateway(container)(
      "test-manager@email.com",
      "TESTPASSWORD"
    );

    expect(validUser).toEqual(true);
    expect(trust_id).toEqual(user.organisation_id);
    expect(user_id).toEqual(user.id);
    expect(type).toEqual("manager");
    expect(error).toBeNull();
  });

  it("errors if wrong password is passed in", async () => {
    await setUpManager({
      email: "test-admin@email.com",
      password: "TESTPASSWORD",
      type: "admin",
    });

    const {
      validUser,
      trust_id,
      type,
      user_id,
      error,
    } = await verifyUserLoginGateway(container)(
      "test-admin@email.com",
      "INVALIDPASSWORD"
    );

    expect(validUser).toEqual(false);
    expect(trust_id).toBeNull();
    expect(user_id).toBeNull();
    expect(type).toBeNull();
    expect(error).toEqual("Incorrect email or password");
  });

  it("errors if the email is not in the database", async () => {
    await setUpManager({
      email: "test-admin@email.com",
      password: "TESTPASSWORD",
      type: "admin",
    });

    const {
      validUser,
      trust_id,
      type,
      user_id,
      error,
    } = await verifyUserLoginGateway(container)(
      "wrong@email.com",
      "TESTPASSWORD"
    );

    expect(validUser).toEqual(false);
    expect(trust_id).toBeNull();
    expect(user_id).toBeNull();
    expect(type).toBeNull();
    expect(error).toEqual("Email does not exist in the database");
  });
});
