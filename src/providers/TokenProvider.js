import jwt from "jsonwebtoken";

const version = "3";

class TokenProvider {
  constructor(signingKey) {
    this.signingKey = signingKey;
  }

  generate({ wardId, wardCode, trustId, type, userId }) {
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

  generateTokenForLink(uuid, hash, expirationTime, secret, email) {
    let tokenObj = { uuid, hash, version };

    if (secret !== this.signingKey) {
      tokenObj = { ...tokenObj, hashedPassword: secret, emailAddress: email };
    }

    return jwt.sign(tokenObj, secret, {
      algorithm: ["HS256"],
      expiresIn: expirationTime,
    });
  }

  retrieveEmailFromToken(token) {
    try {
      const { emailAddress } = jwt.decode(token);
      return { emailAddress };
    } catch (error) {
      return { emailAddress: "" };
    }
  }

  retrieveIdFromToken(token) {
    try {
      const { id } = jwt.decode(token);
      return { id };
    } catch (error) {
      return { id: "" };
    }
  }

  verifyTokenFromLink(token, secret = this.signingKey) {
    console.log(secret);
    try {
      const decryptedToken = jwt.verify(token, secret, {
        algorithms: "HS256",
      });

      if (decryptedToken.version !== version) {
        throw new Error("Invalid token version");
      }
      return {
        decryptedToken,
        errorToken: "",
      };
    } catch (error) {
      console.log(error, secret);
      return {
        decryptedToken: null,
        errorToken: "Error verifying token",
      };
    }
  }
}

export default TokenProvider;
