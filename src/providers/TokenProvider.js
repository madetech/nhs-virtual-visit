import jwt from "jsonwebtoken";

const version = "3";

class TokenProvider {
  constructor(signingKey) {
    this.signingKey = signingKey;
  }

  generate({ wardId, wardCode, trustId, type, userId }) {
    console.log(userId);
    return jwt.sign(
      // If updating the token structure, update the version
      {
        wardId,
        ward: wardCode,
        trustId,
        version,
        type,
        userId,
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

  retrieveEmailFromToken(token) {
    try {
      const { emailAddress } = jwt.decode(token);
      return { emailAddress };
    } catch (error) {
      return { emailAddress: "" };
    }
  }

  verifyTokenNotUsed(token, secret) {
    try {
      jwt.verify(token, secret);
      return {
        errorToken: "",
      };
    } catch (error) {
      return {
        errorToken:
          "Link is incorrect or has expired. Please reset your password again to get a new link.",
      };
    }
  }
}

export default TokenProvider;
