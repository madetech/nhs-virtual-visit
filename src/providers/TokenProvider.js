import jwt from "jsonwebtoken";

const version = "3";

class TokenProvider {
  constructor(signingKey) {
    this.signingKey = signingKey;
  }

  generate({ wardId, wardCode, trustId, type }) {
    return jwt.sign(
      // If updating the token structure, update the version
      {
        wardId,
        ward: wardCode,
        trustId,
        version,
        type,
      },
      this.signingKey,
      {
        algorithm: "HS256",
        expiresIn: "14h",
      }
    );
  }

  validate(token) {
    const decryptedToken = jwt.verify(token, this.signingKey, {
      algorithms: ["HS256"],
    });

    if (decryptedToken.version !== version) {
      throw new Error("Invalid token version");
    }

    return decryptedToken;
  }

  verifyTokenAndRetrieveEmail(token) {
    try {
      jwt.verify(token, this.signingKey);
      const { emailAddress } = jwt.decode(token);
      return {
        emailAddress,
      };
    } catch (error) {
      return {
        emailAddress: "",
      };
    }
  }
}

export default TokenProvider;
