import resetPassword from "../../src/usecases/resetPassword";
import mockAppContainer from "src/containers/AppContainer";
describe("resetPassword", () => {
  let resetPasswordGatewaySpy;
  beforeEach(async () => {
    resetPasswordGatewaySpy = jest
      .fn()
      .mockResolvedValue({ resetSuccess: true, error: null });
    mockAppContainer.getResetPasswordGateway.mockImplementation(
      () => resetPasswordGatewaySpy
    );
  });
  it("errors if no password is present", async () => {
    // Arrange
    const request = { password: "", email: "nhs-admin@nhs.co.uk" };
    // Act
    const { resetSuccess, error } = await resetPassword(mockAppContainer)(
      request
    );
    // Assert
    expect(resetSuccess).toEqual(false);
    expect(error).toEqual("password is not defined");
  });

  it("errors if no email is present", async () => {
    // Arrange
    const request = { password: "validPassword", email: "" };
    // Act
    const { resetSuccess, error } = await resetPassword(mockAppContainer)(
      request
    );
    // Assert
    expect(resetSuccess).toEqual(false);
    expect(error).toEqual("email is not defined");
  });

  it("resets the password with valid email and password", async () => {
    // Arrange
    const request = { password: "validPassword", email: "nhs-admin@nhs.co.uk" };
    // Act
    const { resetSuccess, error } = await resetPassword(mockAppContainer)(
      request
    );
    // Assert
    expect(resetSuccess).toEqual(true);
    expect(error).toBeNull();
    expect(resetPasswordGatewaySpy).toBeCalledWith(request);
  });

  it("errors if no records are found for a given email", async () => {
    // Arrange
    resetPasswordGatewaySpy = jest
      .fn()
      .mockResolvedValue({
        resetSuccess: false,
        error: "User email doesn't exist",
      });
    const request = {
      password: "validPassword",
      email: "invalid-email@nhs.co.uk",
    };
    // Act
    const { resetSuccess, error } = await resetPassword(mockAppContainer)(
      request
    );
    // Assert
    expect(resetSuccess).toEqual(false);
    expect(error).toEqual("User email doesn't exist");
  });
  it("errors if there is a problem with the database call", async () => {
    // Arrange
    resetPasswordGatewaySpy = jest.fn(async () => {
      throw new Error("DB Error!");
    });
    const request = { password: "validPassword", email: "nhs-admin@nhs.co.uk" };
    // Act
    const { resetSuccess, error } = await resetPassword(mockAppContainer)(
      request
    );
    // Assert
    expect(resetSuccess).toEqual(false);
    expect(error).toEqual("Error: DB Error!");
  });
});
