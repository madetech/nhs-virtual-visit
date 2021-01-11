import jwt from "jsonwebtoken";
import MsSQL from "../gateways/MsSQL";

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

  // retrieveEmailFromToken(token) {
  //   try {
  //     const { emailAddress} = jwt.decode(token);
  //     return emailAddress;
  //   } catch (error) {
  //     return {emailAddress:""};
  //   }

  // }
  async verifyTokenAndRetrieveEmail(token) {
    const db = await MsSQL.getConnectionPool();

    try {
      const { emailAddress } = jwt.decode(token);

      try {
        const dbResponse = await db
          .request()
          .input("emailAddress", emailAddress)
          .query(`SELECT password from dbo.[user] WHERE email = @emailAddress`);

        const secret = dbResponse.recordset[0].password;
        jwt.verify(token, secret);

        return {
          emailAddress,
        };
      } catch (err) {
        return { emailAddress: "" };
      }
    } catch (error) {
      return {
        emailAddress: "",
      };
    }
  }
}

export default TokenProvider;
