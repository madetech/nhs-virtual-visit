import verifyAdminCode from "../../src/usecases/verifyAdminCode";
import AppContainer from "../../src/containers/AppContainer";
import setupAdmin from "../../test/testUtils/setupAdmin";

describe("verifyAdminCode contract tests", () => {
  const container = AppContainer.getInstance();

  it("verifies if a admin code and password match an existing trust", async () => {
    await setupAdmin(container)({
      email: "test@email.com",
      password: "TESTPASSWORD",
    });

    const { validAdminCode, error } = await verifyAdminCode(container)(
      "test@email.com",
      "TESTPASSWORD"
    );

    expect(validAdminCode).toEqual(true);
    expect(error).toBeNull();
  });

  it("is not valid if the password is not provided", async () => {
    await setupAdmin(container)({
      email: "test@email.com",
      password: "TESTPASSWORD",
    });

    const { validAdminCode, error } = await verifyAdminCode(container)(
      "TESTCODE"
    );

    expect(validAdminCode).toEqual(false);
    expect(error).toBe("password is not defined");
  });

  it("is not valid if the email is incorrect", async () => {
    await setupAdmin(container)({
      email: "test@email.com",
      password: "TESTPASSWORD",
    });

    const { validAdminCode, error } = await verifyAdminCode(container)(
      "wrong@email.com",
      "TESTPASSWORD"
    );

    expect(validAdminCode).toEqual(false);
    expect(error).toBeNull();
  });

  it("is not valid if the password is incorrect", async () => {
    await setupAdmin(container)({
      email: "test@email.com",
      password: "TESTPASSWORD",
    });

    const { validAdminCode, error } = await verifyAdminCode(container)(
      "test@email.com",
      "WRONGPASSWORD"
    );

    expect(validAdminCode).toEqual(false);
    expect(error).toBe("Incorrect email or password");
  });
});
