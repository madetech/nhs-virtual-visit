import jwt from "jsonwebtoken";
import TokenProvider from "./TokenProvider";

describe("TokenProvider", () => {
  it("should verify a valid token", () => {
    jwt.verify = jest.fn().mockReturnValue({
      version: "2",
      wardId: 1,
      ward: "123",
      admin: false,
      trustId: 2,
    });

    const tokenProvider = new TokenProvider();

    const token = tokenProvider.validate("token");

    expect(token.version).toEqual("2");
  });

  it("should reject a token with an invalid version", () => {
    jwt.verify = jest.fn().mockReturnValue({
      version: 1,
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
});
