import jwt from "jsonwebtoken";
import TokenProvider from "../../src/providers/TokenProvider";

describe("TokenProvider", () => {
  it("should verify a valid token", () => {
    jwt.verify = jest.fn().mockReturnValue({
      version: "3",
      wardId: 1,
      ward: "123",
      trustId: 2,
      type: "wardStaff",
      userId: undefined,
    });

    const tokenProvider = new TokenProvider();

    const token = tokenProvider.validate("token");

    expect(token.version).toEqual("3");
  });

  it("should reject a token with an invalid version", () => {
    jwt.verify = jest.fn().mockReturnValue({
      version: 1,
      wardId: 1,
      ward: "123",
      trustId: 2,
      type: "wardStaff",
      userId: undefined,
    });

    const tokenProvider = new TokenProvider();

    expect(() => {
      tokenProvider.validate("token");
    }).toThrowError("Invalid token version");
  });

  it("should reject an invalid token", () => {
    jwt.verify = jest.fn().mockImplementation(() => {
      throw new Error("Error!");
    });

    const tokenProvider = new TokenProvider();

    expect(() => {
      tokenProvider.validate("token");
    }).toThrowError();
  });

  it("should reject a token without a version", () => {
    jwt.verify = jest.fn().mockReturnValue({
      wardId: 1,
      ward: "123",
      admin: false,
      trustId: 2,
    });

    const tokenProvider = new TokenProvider();

    expect(() => {
      tokenProvider.validate("token");
    }).toThrowError("Invalid token version");
  });

  it("should return an email address from a given token", () => {
    jwt.decode = jest.fn().mockReturnValue({ emailAddress: "test@email.com" });

    const tokenProvider = new TokenProvider();
    const token = tokenProvider.retrieveEmailFromToken("token");

    expect(token.emailAddress).toEqual("test@email.com");
  });

  it("should return an empty string, when there is no email address", () => {
    jwt.decode = jest.fn().mockReturnValue();

    const tokenProvider = new TokenProvider();
    const token = tokenProvider.retrieveEmailFromToken("token");

    expect(token.emailAddress).toEqual("");
  });

  it("should return the decryptedToken when token is verified", () => {
    jwt.verify = jest.fn().mockReturnValue({
      version: "3",
    });

    const tokenProvider = new TokenProvider();

    const { decryptedToken, errorToken } = tokenProvider.verifyTokenFromLink(
      "token",
      "secret"
    );

    expect(decryptedToken.version).toEqual("3");
    expect(errorToken).toEqual("");
  });

  it("should return an error when token isn't verrified", () => {
    jwt.verify = jest.fn().mockImplementation(() => {
      throw new Error("error");
    });

    const tokenProvider = new TokenProvider();

    const { decryptedToken, errorToken } = tokenProvider.verifyTokenFromLink(
      "invalidToken",
      "invalidSecret"
    );

    expect(decryptedToken).toBeNull();
    expect(errorToken).toEqual("Error verifying token");
  });
});
