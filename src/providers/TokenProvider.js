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
}

export default TokenProvider;
