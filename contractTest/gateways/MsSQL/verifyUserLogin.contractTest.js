import verifyUserLogin from "../../../src/gateways/MsSQL/verifyUserLogin";
import AppContainer from "../../../src/containers/AppContainer";
import setupUser from "../../../test/testUtils/setupUser";

describe("verifyUserLogin contract tests", () => {
  const container = AppContainer.getInstance();

  xit("verifies if a admin code and password match an existing trust", async () => {
    await setupUser(container)({
      email: "test@email.com",
      password: "TESTPASSWORD",
      type: "admin",
    });

    const { validUser, type, error } = await verifyUserLogin(
      "test@email.com",
      "TESTPASSWORD"
    );

    expect(validUser).toEqual(true);
    expect(type).toEqual("admin");
    expect(error).toBeNull();
  });

  xit("is not valid if the password is not provided", async () => {
    await setupUser(container)({
      email: "test@email.com",
      password: "TESTPASSWORD",
    });

    const { validAdminCode, error } = await verifyUserLogin(container)(
      "TESTCODE"
    );

    expect(validAdminCode).toEqual(false);
    expect(error).toBe("password is not defined");
  });

  xit("is not valid if the email is incorrect", async () => {
    await setupUser(container)({
      email: "test@email.com",
      password: "TESTPASSWORD",
    });

    const { validAdminCode, error } = await verifyUserLogin(container)(
      "wrong@email.com",
      "TESTPASSWORD"
    );

    expect(validAdminCode).toEqual(false);
    expect(error).toBeNull();
  });

  xit("is not valid if the password is incorrect", async () => {
    await setupUser(container)({
      email: "test@email.com",
      password: "TESTPASSWORD",
    });

    const { validAdminCode, error } = await verifyUserLogin(container)(
      "test@email.com",
      "WRONGPASSWORD"
    );

    expect(validAdminCode).toEqual(false);
    expect(error).toBe("Incorrect email or password");
  });
});
