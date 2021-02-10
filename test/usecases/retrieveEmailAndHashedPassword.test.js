import retrieveEmailAndHashedPassword from "../../src/usecases/retrieveEmailAndHashedPassword";
import mockAppContainer from "src/containers/AppContainer";
describe("retrieveEmailAndHashedPassword", () => {
  const expectedEmail = "nhs-admin@nhs.co.uk";
  const expectedHashedPassword = "hashed password";
  let getRetrieveEmailAndHashedPasswordGatewaySpy;
  beforeEach(async () => {
    getRetrieveEmailAndHashedPasswordGatewaySpy = jest.fn().mockResolvedValue({
      user: {
        emailAddress: expectedEmail,
        hashedPassword: expectedHashedPassword,
      },
      error: null,
    });
    mockAppContainer.getRetrieveEmailAndHashedPasswordGateway.mockImplementationOnce(
      () => getRetrieveEmailAndHashedPasswordGatewaySpy
    );
  });
  it("returns the email address and hashed password with valid email", async () => {
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
    expect(getRetrieveEmailAndHashedPasswordGatewaySpy).toHaveBeenCalledWith({
      email: expectedEmail,
    });
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
    getRetrieveEmailAndHashedPasswordGatewaySpy = jest.fn().mockResolvedValue({
      user: [],
      error: null,
    });
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
