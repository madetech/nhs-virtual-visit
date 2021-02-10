import verifyResetPasswordLink from "../../src/usecases/verifyResetPasswordLink";
import moment from "moment";
import retrieveEmailAndHashedPasswordGateway from "../../src/gateways/MsSQL/retrieveEmailAndHashedPassword";

jest.mock("../../src/gateways/MsSQL/retrieveEmailAndHashedPassword");

describe("verifyResetPasswordLink", () => {
  let container, token, tokenProvider;
  beforeEach(async () => {
    token = {
      emailAddress: "test@email.com",
      exp: moment().add(2, "hours").unix(),
    };
    tokenProvider = {
      retrieveEmailFromToken: jest.fn(() => {
        return { emailAddress: token.emailAddress };
      }),
      verifyTokenFromLink: jest.fn(() => {
        return { decryptedToken: token, errorToken: "" };
      }),
      verifyTokenNotUsed: jest.fn(() => {
        return { decryptedToken: token, errorToken: "" };
      }),
    };
    retrieveEmailAndHashedPasswordGateway.mockImplementation(() => {
      return { user: { hashedPassword: "hashedPassword" } };
    });
    container = {
      getTokenProvider: () => tokenProvider,
      getRetrieveEmailAndHashedPasswordGateway: () =>
        retrieveEmailAndHashedPasswordGateway,
    };
  });
  it("returns an email address if the link is valid", async () => {
    // Act
    const { email, error } = await verifyResetPasswordLink(container)(token);
    // Assert
    expect(email).toEqual("test@email.com");
    expect(error).toBeNull();
  });

  it("returns an error it there is no email in the token", async () => {
    // Arrange
    token = {
      emailAddress: "",
      exp: moment().add(2, "hours").unix(),
    };
    // Act
    const { email, error } = await verifyResetPasswordLink(container)(token);
    // Assert
    expect(email).toEqual("");
    expect(error).toEqual("Email address does not exist");
  });

  it("returns an error if the link has been used", async () => {
    // Arrange
    tokenProvider = {
      ...tokenProvider,
      verifyTokenFromLink: jest.fn(() => {
        return { decryptedToken: "", errorToken: "error" };
      }),
    };
    // Act
    const { email, error } = await verifyResetPasswordLink(container)(token);
    // Assert
    expect(email).toBeFalsy();
    expect(error).toEqual(
      "Link is incorrect or expired. Please reset password again"
    );
  });
});
