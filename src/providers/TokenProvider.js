import jwt from "jsonwebtoken";

class TokenProvider {
  constructor(signingKey) {
    this.signingKey = signingKey;
  }

  generate(ward) {
    return jwt.sign({ ward }, this.signingKey, { algorithm: "HS256" });
  }

  validate(token) {
    return jwt.verify(token, this.signingKey, { algorithms: ["HS256"] });
  }
}

export default TokenProvider;
