import retrieveEmailAndHashedPassword from "../../src/usecases/retrieveEmailAndHashedPassword";
import mockAppContainer from "src/containers/AppContainer";
describe("retrieveEmailAndHashedPassword", () => {
  it("returns the email address and hashed password with valid email", async () => {
    // Arrange
    const expectedEmail = "nhs-admin@nhs.co.uk";
    const expectedHashedPassword = "hashed password";
    const getRetrieveEmailAndHashedPasswordGatewaySpy = jest.fn(() =>
      Promise.resolve({
        user: {
          emailAddress: expectedEmail,
          hashedPassword: expectedHashedPassword,
        },
        error: null,
      })
    );
    mockAppContainer.getRetrieveEmailAndHashedPasswordGateway.mockImplementationOnce(
      () => getRetrieveEmailAndHashedPasswordGatewaySpy
    );
    // Act
    const {
      emailAddress,
      hashedPassword,
      error,
    } = await retrieveEmailAndHashedPassword(mockAppContainer)(expectedEmail);
    // Assert
    expect(emailAddress).toEqual(expectedEmail);
    expect(hashedPassword).toEqual(expectedHashedPassword);
    expect(error).toBeNull();
    expect(getRetrieveEmailAndHashedPasswordGatewaySpy).toHaveBeenCalledWith(
      expectedEmail
    );
  });
  it("errors if no email is present", async () => {
    // Arrange
    const expectedEmail = "";
    // Act
    const {
      emailAddress,
      hashedPassword,
      error,
    } = await retrieveEmailAndHashedPassword(mockAppContainer)(expectedEmail);
    // Assert
    expect(emailAddress).toEqual(expectedEmail);
    expect(hashedPassword).toEqual("");
    expect(error).toEqual("email is not defined");
  });
  it("returns [] if no record found", async () => {
    // Arrange
    const expectedEmail = "invalid-email@nhs.co.uk";
    const getRetrieveEmailAndHashedPasswordGatewaySpy = jest.fn(() =>
      Promise.resolve({
        user: [],
        error: null,
      })
    );
    mockAppContainer.getRetrieveEmailAndHashedPasswordGateway.mockImplementationOnce(
      () => getRetrieveEmailAndHashedPasswordGatewaySpy
    );
    // Act
    const {
      emailAddress,
      hashedPassword,
      error,
    } = await retrieveEmailAndHashedPassword(mockAppContainer)(expectedEmail);
    // Assert
    expect(emailAddress).toBeFalsy();
    expect(hashedPassword).toBeFalsy();
    expect(error).toBeNull();
  });
});
