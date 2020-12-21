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
