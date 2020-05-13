import jwt from "jsonwebtoken";

class TokenProvider {
  constructor(signingKey) {
    this.signingKey = signingKey;
  }

  generate({ wardId, wardCode, admin, trustId }) {
    return jwt.sign(
      { wardId, ward: wardCode, admin: admin, trustId: trustId },
      this.signingKey,
      {
        algorithm: "HS256",
      }
    );
  }

  validate(token) {
    return jwt.verify(token, this.signingKey, { algorithms: ["HS256"] });
  }
}

export default TokenProvider;
