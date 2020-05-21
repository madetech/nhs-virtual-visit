import withContainer from "../../src/middleware/withContainer";
const { WARD_STAFF, TRUST_ADMIN } = require("../../src/helpers/tokenTypes");

export default withContainer(
  async ({ body: { code }, method }, res, { container }) => {
    if (method === "POST") {
      const verifyWardCode = container.getVerifyWardCode();
      const verifyWardCodeResponse = await verifyWardCode(code);

      const verifyTrustAdminCode = container.getVerifyTrustAdminCode();
      const verifyTrustAdminCodeResponse = await verifyTrustAdminCode(code);

      if (
        !verifyTrustAdminCodeResponse.validTrustAdminCode &&
        !verifyWardCodeResponse.validWardCode
      ) {
        res.statusCode = 401;
        res.end();
        return;
      }

      let token = undefined;
      const tokens = container.getTokenProvider();
      if (verifyTrustAdminCodeResponse.validTrustAdminCode) {
        token = tokens.generate({
          wardId: undefined,
          wardCode: undefined,
          trustId: verifyTrustAdminCodeResponse.trust.id,
          type: TRUST_ADMIN,
        });
      } else {
        const { ward } = verifyWardCodeResponse;
        token = tokens.generate({
          wardId: ward.id,
          wardCode: ward.code,
          trustId: ward.trustId,
          type: WARD_STAFF,
        });
      }

      const expiryHours = 2;
      let expiry = new Date();
      if (verifyTrustAdminCodeResponse.validTrustAdminCode) {
        expiry.setTime(expiry.getTime() + 1 * 60 * 60 * 1000);
      } else {
        expiry.setTime(expiry.getTime() + expiryHours * 60 * 60 * 1000);
      }

      res.writeHead(201, {
        "Set-Cookie": `token=${token}; httpOnly; path=/; expires=${expiry}`,
      });
      res.end(JSON.stringify({ wardId: code }));
      return;
    } else if (method === "DELETE") {
      const expired = new Date(0);

      res.writeHead(201, {
        "Set-Cookie": `token=''; httpOnly; path=/; expires=${expired}`,
      });
      res.end(JSON.stringify({ wardId: code }));
      return;
    } else {
      res.statusCode = 406;
      res.end();
      return;
    }
  }
);
